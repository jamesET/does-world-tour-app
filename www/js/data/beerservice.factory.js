(function(){
  'use strict';

  angular
      .module('beers.service',['app.core'])
      .factory('BeerService', BeerService );

      BeerService.$inject = ['$http','$q','ENV','logger','exception','$localStorage'];

      function BeerService($http,$q,ENV,logger,exception,$localStorage) {
        var service = {
          getBeers : getBeers,
          loadStaticBeersCache: loadStaticBeersCache,
          update : update,
          add : add
        };
        return service;

        // get all beers from the server
        function getBeers() {
          var beersUrl = ENV.apiEndpoint + 'beers/browse';
          return $http.get(beersUrl)
            .then(getBeersComplete,getBeersFailed)

            function getBeersComplete(response) {
                // save a local copy of last response
                $localStorage.setObject('beersCache',response.data);
                return response.data;
            }

            function getBeersFailed(reason) {
              var beersCache = $localStorage.getObject('beersCache');
              if (Object.keys(beersCache).length) {
                return beersCache;
              } else {
                beersCache = {};
                return beersCache;
              }
            }
        }

        // This method will populate the beers cache using static data.
        // This will make the browse beer function more reliable
        // when the network is unavailable
        function loadStaticBeersCache() {
          var beersCache = $http.get('static-beers.json')
            .then(function(response) {
              $localStorage.setObject('beersCache',response.data);
            });
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
