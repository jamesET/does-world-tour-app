'use strict';

angular.module('resources',['app.core'])

.factory('sessionInjector',
  ['session','$rootScope','$q','AUTH_EVENTS',
  function(session,$rootScope,$q,AUTH_EVENTS) {
    var sessionInjector = {
        request: function(config) {
            config.headers['X-SECURITY-TOKEN'] = session.getAccessToken();
            return config;
        },
        responseError: function(response) {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated,
                403: AUTH_EVENTS.notAuthorized
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
