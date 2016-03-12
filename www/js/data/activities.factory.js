(function() {
    'use strict';

    angular
        .module('services.activities',['app.core'])
        .factory('ActivityFeed', ActivityFeed);

    ActivityFeed.$inject = ['$http','ENV','logger','exception'];

    /* @ngInject */
    function ActivityFeed($http,ENV,logger,exception) {

        var service = {
            getPage: getPage,
        };
        return service;

        function getPage(page) {
          var activitiesUrl = ENV.apiEndpoint + 'activities';
          return $http(
            {
              method: 'GET',
              url : activitiesUrl,
              params: { page: page}
            })
            .then(getPageComplete)
            .catch(exception.catcher);

          function getPageComplete(response) {
            return response.data;
          }
        }


    }
})();
