(function(){
  'use strict';

  angular
    .module('blocks.exception')
    .factory('exception', exception);

    exception.$inject = ['logger'];

    function exception(logger) {
        var service = {
            catcher: catcher
        };
        return service;

        // More specifically, this is the catcher I plan to use for HTTP calls
        function catcher(title) {
            return function(reason) {
              var data = '';
              var message = '';
              if (reason.data && reason.data.status) {
                data = reason.data.status;
              }
              if (reason.data && reason.data.message) {
                message = reason.data.message;
              }
              if (reason.status && reason.status < 0) {
                  message = 'Sorry! The service is unavailable, please try later.';
              }
              logger.error(message, data, title);
              return $q.reject(reason);
            };
        }
    }


})();
