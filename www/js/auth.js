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
        this.sendPassword = sendPassword;
        this.reset = reset;

        var baseUrl = ENV.apiEndpoint;
        var loginUrl = baseUrl + '/login/';
        var sendPasswordUrl = baseUrl + '/login/sendpass';
        var logoutUrl =  baseUrl + '/logout/';

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
          session.destroy();
          return $http
            .post(logoutUrl)
            .then(logOutComplete)

            function logOutComplete() {
                logger.log('User logged out');
            }
        }

        function sendPassword(email) {
          return $http({
            method: 'POST',
            url: sendPasswordUrl,
            params: { email : email }
          })
          .then(sendSuccess)
          .catch( exception.catcher('Send password failed'));

            function sendSuccess(response) {
              // do nothing
            }

        }

        function isAuthenticated() {
          // if we have a token then we will assume authentication
          // ... the app should clear the token upon processing a 401
          var token = session.getAccessToken();
          if (token != null && token.length > 0) {
              return true;
          } else {
            return false;
          }
        }

        function isAdmin() {
          if (!isAuthenticated()) {
            return false;
          }
            if (session.getRole() === 'ADMIN') {
              return true;
            } else {
              return false;
            }
        }

        function reset() {
            session.setAccessToken(null);
        }


    }
})();
