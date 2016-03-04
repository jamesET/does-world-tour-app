(function() {
    'use strict';

    angular
        .module('app.account')
        .controller('AccountController', AccountController);

    AccountController.$inject = ['$scope','$state','$ionicModal','UserService','logger','session','auth'];

    /* @ngInject */
    function AccountController($scope,$state,$ionicModal,UserService,logger,session,auth) {
        $scope.accountData = {};
        $scope.refresh = refresh;
        $scope.accountUpdate = accountUpdate;
        $scope.validateForm = validateForm;

        $scope.$on('$ionicView.enter',refresh);

        function refresh() {
          var ud = session.getUserData();
          var pwd = session.getPassword();
          $scope.accountData = {
            email : ud.email,
            password: pwd,
            password2 : pwd,
            name : ud.name,
            nickName : ud.nickName,
            role : ud.role
          };
        }

        function accountUpdate() {
            if (!validateForm()) {
              return;
            }

            var form = $scope.accountData;
            var updateData = {
                id : session.getUser(),
                email : form.email,
                password: form.password,
                name: form.name,
                nickName : form.nickName,
            };

            UserService.update(updateData)
              .then(accountUpdated);

            function accountUpdated() {
              alert('Account update requires new login');
              auth.logOut();
              $state.go('login');
            }

        }

        function validateForm() {
            var isValid = true;
            var form = $scope.accountData;
            if (form.password !== form.password2) {
              logger.error('Passwords do not match','','Please correct');
              isValid = false;
            }

            if (!form.name) {
              logger.error('Name is required','','Please correct');
              isValid = false;
            }
            return isValid;
        }

    }
})();
