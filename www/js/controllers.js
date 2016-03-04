'use strict';

angular.module('starter.controllers', ['resources','services.user','app.core'])

.controller('AppCtrl', function($scope, $timeout, $http, $state, $interval, auth, session) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.errorMessage = '';

  $scope.logOut = function() {
      auth.logOut();
      $state.go('start');
  };

})

.controller('StartCtrl', function($scope,$state,session) {

  // Navigate to the login form
  $scope.login = function() {
      $state.go('login');
  };

  // Navigate to the signup form
  $scope.join = function() {
      $state.go('join');
  };

  $scope.browse = function() {
    $state.go('app.beers');
  };
})

.controller('LoginCtrl', function($scope,$state,session,auth) {
  var vm = this;
  vm.activate = activate;
  vm.clearFormData = clearFormData;
  vm.restoreFormData = restoreFormData;

  activate();

  function activate() {
    restoreFormData();
    $scope.$on('$ionicView.enter', restoreFormData );
  }

  function clearFormData() {
    $scope.loginData = {
        username : '',
        password : ''
    };
  }

  function restoreFormData() {
    clearFormData();

    var username = session.getEmail();
    if (username) {
      $scope.loginData.username = username;
    }

    var password = session.getPassword();
    if (password) {
      $scope.loginData.password = password;
    }
  }


  // Let the user go back to the start page
  $scope.back = function() {
      $state.go('start');
  };

  // Perform the login action when the user submits the login form
  $scope.login = function() {
    $scope.errorMessage = '';
    auth.logIn($scope.loginData.username,$scope.loginData.password)
      .then(loginComplete);

      function loginComplete() {
          if (auth.isAuthenticated()) {
            clearFormData();
            $state.go('app.mybeerlist');
          }
      }
  }

})

.controller('JoinCtrl', function($scope,$state,session,UserService) {

  $scope.acctData = { };
  $scope.errorMessage = '';

  $scope.back = function() {
      $state.go('start');
  };

  $scope.join = function() {
    $scope.errorMessage = '';

    var newUser = {
        email : $scope.acctData.email,
        name : $scope.acctData.name,
        password : $scope.acctData.password,
        nickName : $scope.acctData.nickName
    };

    var password2 = $scope.acctData.password2;
    if (newUser.password !== password2) {
        $scope.errorMessage = 'passwords do not match, please re-enter password';
        return;
    }

    UserService.signup(newUser)
      .then(function(response){
          // success, go login for the first time
          session.setEmail(newUser.email);
          $state.go('login');
      },
      function(response){
          $scope.errorMessage = response.data.message;
      }
    );

  };

});
