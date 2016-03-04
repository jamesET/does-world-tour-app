(function() {
    'use strict';

    angular
        .module('services.user',['app.core'])
        .factory('UserService', UserService);

    UserService.$inject = ['$http','ENV','logger','exception'];

    /* @ngInject */
    function UserService($http,ENV,logger,exception) {

        var service = {
            signup: signup,
            getUsers: getUsers,
            update: update,
            adminEdit: adminEdit
        };

        return service;

        function signup(newUser) {
          var signupUrl = ENV.apiEndpoint + 'users/signup/';
          return $http.post(signupUrl,newUser)
            .then(signupComplete())
            .catch(exception.catcher);

          function signupComplete(data) {
            return data;
          }
        }

        function getUsers() {
          var usersUrl = ENV.apiEndpoint + 'users/';
          return $http.get(usersUrl)
            .then( getUsersComplete )
            .catch (exception.catcher);

            function getUsersComplete(data) {
              return data;
            }
        }

        function update(user) {
            var updateUrl = ENV.apiEndpoint + 'users/';
            return $http.put(updateUrl,user)
              .then( updateComplete )
              .catch( exception.catcher );

            function updateComplete(data) {
              return data;
            }

        }

        function adminEdit(user) {
          var updateUrl = ENV.apiEndpoint + 'users/' + user.id + '/adminEdit';
          var editUser = {
              role: user.role
          };

          return $http.put(updateUrl,editUser)
            .then(adminEditComplete)
            .catch(exception.catcher);

          function adminEditComplete(data) {
              return data;
          }
        }

    }
})();
