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

.controller('LoginCtrl', function($scope,$state,session,auth,logger,$ionicLoading) {
  var vm = this;
  vm.activate = activate;
  vm.clearFormData = clearFormData;
  vm.restoreFormData = restoreFormData;
  vm.showLoading = showLoading;
  vm.hideLoading = hideLoading;

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


  $scope.forgotPassword = function(email) {
    console.log('forgotPassword ' + email);

    showLoading();
    auth.sendPassword(email)
      .then(sendComplete,sendFailed)
      .finally(hideLoading)

    function sendComplete(response) {
        hideLoading();
        logger.info('Password sent to email',email,'Forgot Password');
    }
  }

  function showLoading() {
    $ionicLoading.show({
      template: '<h1>Emailing password.  Please wait ...</h1>'
    });
  }

  function hideLoading(){
    $ionicLoading.hide();
  }

})

.controller('JoinCtrl', function($scope,$state,session,UserService,exception) {

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
        nickName : $scope.acctData.nickName,
        numListsCompleted : parseInt($scope.acctData.listNbr)
    };

    var password2 = $scope.acctData.password2;
    if (newUser.password !== password2) {
        $scope.errorMessage = 'passwords do not match, please re-enter password';
        return;
    }

    if (newUser.numListsCompleted < 1 || newUser.numListsCompleted > 30) {
      $scope.errorMessage = 'Lists finished must be between 1 and 30';
      return;
    }

    UserService.signup(newUser)
      .then(signupComplete,signupFailed)
      .catch(exception.catcher);

      function signupComplete(response) {
          if (response) {
            session.setEmail(newUser.email);
            $state.go('login');
          }
      }

      function signupFailed(response) {
          var nothing = true;
      }

  };

});
