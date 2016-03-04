(function() {
    'use strict';

    angular
        .module('app.beerlists')
        .controller('BeerListController', BeerListController);

    BeerListController.$inject = ['$scope','BeerListService','logger','$cordovaGeolocation'];

    /* @ngInject */
    function BeerListController($scope,BeerListService,logger,$cordovaGeolocation) {
        var vm = this;
        $scope.myBeerList = {};
        $scope.groupedList = {};
        $scope.refresh = refresh;
        $scope.drinkBeer = drinkBeer;
        $scope.toggleGroup = toggleGroup;
        $scope.isGroupShown = isGroupShown;
        $scope.getGroupedBeerList = getGroupedBeerList;
        vm.ifInRangeOfDoes = ifInRangeOfDoes;
        vm.isAtDoes = false;

        activate();

        function activate() {
          $scope.$on('$ionicView.enter', function(e) {
            $scope.refresh();
          });

          /** Extend Number object with method to convert numeric degrees to radians */
          if (Number.prototype.toRadians === undefined) {
            Number.prototype.toRadians = function() { return this * Math.PI / 180; };
          }

          /** Extend Number object with method to convert radians to numeric (signed) degrees */
          if (Number.prototype.toDegrees === undefined) {
            Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
          }
        }

        function refresh() {
            BeerListService.getBeerList()
              .then(function(beerlist){
                $scope.myBeerList = beerlist.data;
                $scope.groupedList = null;
                $scope.groupedList = getGroupedBeerList($scope.myBeerList.drinkList);
              })
              .finally(function(){
                    $scope.$broadcast('scroll.refreshComplete');
              });
        }

        function drinkBeer(listId,beerOnListId) {

          ifInRangeOfDoes()
            .then(processDrink,locationUnavailable);

          function processDrink() {
            // vm.isAtDoes = true;  // just for testing
            if (vm.isAtDoes) {
              BeerListService.drinkBeer(listId,beerOnListId)
                .then(function() {
                    $scope.refresh();
                  });
            } else {
              logger.info('You must be at Doe\'s Bentonville to drink','','Not at Doe\'s');
            }
          }

          function locationUnavailable() {
              logger.info('Unable to verify you\'re at Doe\'s','','Location Unavailable');
          }

        }

        function ifInRangeOfDoes() {
          var posOptions = {
              timeout: 10000,
              enableHighAccuracy: false,
              maximumAge: (30*60*1000) };
            return $cordovaGeolocation
              .getCurrentPosition(posOptions)
              .then(positionFound,positionError);

            function positionFound(position) {
              var lat  = position.coords.latitude
              var long = position.coords.longitude
              console.log("Lat=" + lat + " Long=" + long);
              var metersAwayFromDoes = distance(lat,long);
              console.log("Meters From Does: " + metersAwayFromDoes)
              if (metersAwayFromDoes < 500) {
                vm.isAtDoes = true;
              }
            }

            function positionError(err) {
                vm.isAtDoes = false;
                console.log(err);
            }
        }

        function distance(lat2,lon2) {
          // Doe's location
          var lat1 = 36.343847;
          var lon1 = -94.2114914;

          var R = 6371000; // metres
          var φ1 = lat1.toRadians();
          var φ2 = lat2.toRadians();
          var Δφ = (lat2-lat1).toRadians();
          var Δλ = (lon2-lon1).toRadians();

          var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);

          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

          var d = R * c;
          return d;
        }

        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }

        // Take beerlist and group them by country for view
        function getGroupedBeerList(drinkList) {
          var groupedBeerList = {};
          for (var id in drinkList) {
              var country = drinkList[id].beer.country;
              var beer = drinkList[id].beer;

              var countryGroup = groupedBeerList[country];
              if (!countryGroup) {
                  countryGroup = {
                      country : country,
                      beers : [],
                      show : false
                  };
              }
              countryGroup.beers.push(drinkList[id]);
              groupedBeerList[country] = countryGroup;
          }
          return groupedBeerList;
        }

        function toggleGroup(group) {
          group.show = !group.show;
        }

        function isGroupShown(group) {
          return group.show;
        }


    }
})();
