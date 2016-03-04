(function(){
  'use strict';

  angular
      .module('beers.service',['app.core'])
      .factory('BeerService', BeerService );

      BeerService.$inject = ['$http','$q','ENV','logger','exception'];

      function BeerService($http,$q,ENV,logger,exception) {
        var service = {
          getBeers : getBeers,
          update : update,
          add : add
        };
        return service;

        function getBeers() {
          var beersUrl = ENV.apiEndpoint + 'beers/browse';
          return $http.get(beersUrl)
            .then(getBeersComplete)
            .catch(exception.catcher('Retrieve Beers failed.'));

            function getBeersComplete(data) {
                return data;
            }
        }

        function update(beer) {
            var beersUrl = ENV.apiEndpoint + 'beers/';
            return $http.put(beersUrl,beer)
              .then(updateBeerComplete)
              .catch(exception.catcher('Update Beer Failed'));

            function updateBeerComplete(data) {
              return data;
            }
        }


        function add(beer) {
            var beersUrl = ENV.apiEndpoint + 'beers/';
            return $http.post(beersUrl,beer)
              .then(addBeerComplete)
              .catch(exception.catcher('Add Beer Failed'));

            function addBeerComplete(data) {
                return data;
            }
        }

    }

})();
