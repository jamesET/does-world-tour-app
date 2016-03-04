(function() {
    'use strict';

    angular
        .module('Toastr',[])
        .factory('toastr', toastr);

    toastr.$inject = ['$ionicLoading'];

    function toastr($ionicLoading) {
        var service = {
            show : show
        };
        return service;

        function show(message,data,title) {
          $ionicLoading.show({
            template: '<h2>' + title + '</h2><br>' + message + '<br>' +  data,
            noBackdrop: true,
            duration: 2000
          });
        }
    }
})();
