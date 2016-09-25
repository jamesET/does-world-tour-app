(function() {
    'use strict';

  // Ionic Starter App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  // 'starter.controllers' is found in controllers.js

    angular
        .module('app', [
          'app.core',
          'starter.controllers',
          'app.beers',
          'app.auth',
          'app.verifybeer',
          'app.users',
          'app.beerlists',
          'app.account',
          'app.activities'
        ])
        .run(runBlock);


    runBlock.$inject = ['$ionicPlatform','$rootScope','$state','AUTH_EVENTS','auth','logger','$timeout'];
    function runBlock($ionicPlatform,$rootScope,$state,AUTH_EVENTS,auth,logger,$timeout) {

        $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }

        if (window.StatusBar) {
           // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });

        $rootScope.$on('$stateChangeStart', function(event,next,nextParams,fromState) {
          if (!auth.isAuthenticated()) {
              var whiteList = ['login','start','join','app.beers'];
              if (whiteList.indexOf(next.name) < 0) {
                console.log('Not authenticated, redirected to login instead of ' + next.name);
                event.preventDefault();
                $state.go('login');
              }
          }
        });

        $rootScope.$on(AUTH_EVENTS.notAuthenticated,handleNoAuth);
        function handleNoAuth() {
            event.preventDefault();
            $timeout(
              function() {logger.warning('<h2>Not logged in</h2>','','');},
              1500
            ).then(
              function() {
                auth.logOut();
                $state.go('start'); }
            );
        }

    }

})();
