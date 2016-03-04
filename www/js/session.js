(function() {
    'use strict';

    angular
        .module('app')
        .service('session', sessionService);

    sessionService.$inject = ['$log','$localStorage'];

    /* @ngInject */
    function sessionService($log,$localStorage) {
        var vm = this;
        vm.activate = activate;
        vm.destroy = destroy;
        vm.getUser = getUser;
        vm.setUser = setUser;
        vm.setRole = setRole;
        vm.getRole = getRole;
        vm.getEmail = getEmail;
        vm.setEmail = setEmail;
        vm.getPassword = getPassword;
        vm.setPassword = setPassword;
        vm.getAccessToken = getAccessToken;
        vm.setAccessToken = setAccessToken;
        vm.getUserData = getUserData;
        vm.setUserData = setUserData;

        activate();

        function activate() {
          // Instantiate data when service is loaded
          vm._user = $localStorage.get('session.user',0);
          vm._email = $localStorage.get('session.email','');
          vm._password = $localStorage.get('session.password','');
          vm._accessToken = $localStorage.get('session.accessToken','');
          vm._role = $localStorage.get('session.role','');
          vm._userData = $localStorage.getObject('session.userData');
        }

        function getUser(){
          return vm._user;
        }

        function setUser(user){
          vm._user = user;
          $localStorage.set('session.user', user);
          return vm;
        }

        function getRole(){
          return vm._role;
        }

        function setRole(role){
          vm._role = role;
          $localStorage.set('session.role', role);
          return vm;
        }

        function getEmail(){
          return vm._email;
        }

        function setEmail(email){
          vm._email = email;
          $localStorage.set('session.email', email);
          return vm;
        }

        function getPassword(){
          return vm._password;
        }

        function setPassword(password){
          vm._password = password;
          $localStorage.set('session.password', password);
          return vm;
        }

        function getAccessToken(){
          return vm._accessToken;
        }

        function setAccessToken(token){
          vm._accessToken = token;
          $localStorage.set('session.accessToken', token);
          return vm;
        }

        function getUserData(){
          return vm._userData;
        }

        function setUserData(userData){
          vm._userData = userData;
          $localStorage.setObject('session.userData', userData);
          return vm;
        }

        /**
         * Destroy session
         */
        function destroy(){
          vm.setUser(null);
          vm.setPassword(null);
          vm.setAccessToken(null);
          vm.setUserData(null);
          vm.setRole(null);
        }

    }

})();
