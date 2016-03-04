(function() {
    'use strict';

    angular
        .module('app.auth',['app.core'])
        .service('auth', AuthService);

    AuthService.$inject = ['$http', '$q', 'session','ENV','logger','exception'];

    /* @ngInject */
    function AuthService($http, $q, session, ENV, logger, exception) {
        this.logIn = logIn;
        this.logOut = logOut;
        this.isAuthenticated = isAuthenticated;
        this.isAdmin = isAdmin;

        var baseUrl = ENV.apiEndpoint;
        var loginUrl = baseUrl + '/login/';
        var logoutUrl =  baseUrl + '/logout/';
        var isAuthenticated = false;

        /**
        * Log in
        *
        * @param credentials
        * @returns {*|Promise}
        */
        function logIn(username,password) {
          session.setEmail(username);
          session.setPassword(password);
          var credentials = {
            username : username,
            password : password
          };
          return $http
            .post(loginUrl, credentials)
            .then( loginSuccess )
            .catch( exception.catcher('Login failed') );

            function loginSuccess(response, status, headers, config) {
                isAuthenticated = true;
                session.setUser(response.data.userId);
                session.setAccessToken(response.data.token);
                session.setUserData(response.data.userTO);
                session.setRole(response.data.userTO.role);
            }
        }

        /**
        * Log out
        *
        * @returns {*|Promise}
        */
        function logOut() {
          isAuthenticated = false;
          session.destroy();
          return $http
            .post(logoutUrl)
            .then(logOutComplete)
            .catch(exception.catcher('Logout failed'));

            function logOutComplete() {
                logger.log('User logged out');
            }
        }

        function isAuthenticated() {
          return isAuthenticated;
        }

        function isAdmin() {
          if (!isAuthenticated) {
            return false;
          }
            if (session.getRole() === 'ADMIN') {
              return true;
            } else {
              return false;
            }
        }


    }
})();
