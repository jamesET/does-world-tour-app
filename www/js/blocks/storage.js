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
            getObject: getObject
        };

        return service;

        function set(key,value) {
          $window.localStorage[key] = value;
        }

        function get(key,defaultValue) {
          return $window.localStorage[key] || defaultValue;
        }

        function setObject(key,value) {
          $window.localStorage[key] = JSON.stringify(value);
        }

        function getObject(key) {
          return JSON.parse($window.localStorage[key] || '{}');
        }
    }
})();
