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

        function getPage(page,userId,newsOnly) {
          var activitiesUrl = ENV.apiEndpoint + 'activities/v2';
          return $http(
            {
              method: 'GET',
              url : activitiesUrl,
              params:
                { page: page,
                  userId: userId,
                  newsOnly: newsOnly
                }
            })
            .then(getPageComplete)
            .catch(exception.catcher);

          function getPageComplete(response) {
            return response.data;
          }
        }


    }
})();
