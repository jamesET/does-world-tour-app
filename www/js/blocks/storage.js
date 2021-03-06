(function() {
    'use strict';

    angular
        .module('blocks.storage')
        .factory('$localStorage', factory);

    factory.$inject = ['$window'];

    /* @ngInject */
    function factory($window) {
        var service = {
            set: set,
            get: get,
            setObject: setObject,
            getObject: getObject,
            remove: remove
        };

        return service;

        function set(key,value) {
          if (value === null) {
            remove(key);
          } else {
            $window.localStorage[key] = value;
          }
        }

        function get(key,defaultValue) {
          return $window.localStorage[key] || defaultValue;
        }

        function setObject(key,value) {
          if (value === null) {
              remove(key);
          } else {
            $window.localStorage[key] = JSON.stringify(value);
          }
        }

        function getObject(key) {
          return JSON.parse($window.localStorage[key] || '{}');
        }

        function remove(key) {
            $window.localStorage.removeItem(key);
        }
    }
})();
