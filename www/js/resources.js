'use strict';

angular.module('resources',['app.core'])

.factory('sessionInjector',
  ['session','$rootScope','$q','APP_EVENTS',
  function(session,$rootScope,$q,APP_EVENTS) {
    var sessionInjector = {
        request: function(config) {
            config.headers['X-SECURITY-TOKEN'] = session.getAccessToken();
            return config;
        },
        responseError: function(response) {
            if (response.status <= 0) {
              console.log('Network error or server is offline ' + response.status);
              response.status = 0;
            }
            $rootScope.$broadcast({
                  0: APP_EVENTS.serverNoResponse,
                401: APP_EVENTS.notAuthenticated,
                403: APP_EVENTS.notAuthorized
            }[response.status],response);
            return $q.reject(response);
        }
    };
    return sessionInjector;
}])

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('sessionInjector');
    $httpProvider.defaults.timeout = 5000;
}]);
