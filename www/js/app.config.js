(function() {
    'use strict';

    angular
        .module('app')
        .config(configure);


    configure.$inject = ['$stateProvider','$urlRouterProvider'];
    function configure($stateProvider,$urlRouterProvider) {
        $stateProvider
        .state('start', {
            url: '/start',
            templateUrl: 'templates/start.html',
            controller: 'StartCtrl'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
        })

        .state('join', {
            url: '/join',
            templateUrl: 'templates/join.html',
            controller: 'JoinCtrl'
        })

        .state('app', {
          url: '/app',
          abstract: true,
          templateUrl: 'templates/menu.html',
          controller: 'AppCtrl'
        })

        .state('app.mybeerlist', {
            url: '/mybeerlist',
            views: {
              'menuContent': {
                templateUrl: 'templates/mybeerlist.html',
                controller: 'BeerListController'
              }
            }
        })

        .state('app.account', {
            url: '/account',
            views: {
              'menuContent': {
                templateUrl: 'templates/account.html',
                controller: 'AccountController'
              }
            }
        })

        .state('app.beers', {
            url: '/beers',
            views: {
              'menuContent': {
                templateUrl: 'templates/beers.html',
                controller: 'BeersController',
                resolve: { beersPrepService : beersPrepService }
              }
            }
        })

        .state('app.users', {
            url: '/users',
            views: {
              'menuContent': {
                templateUrl: 'templates/users.html',
                controller: 'UserMaintController'
              }
            }
        })

        .state('app.completeBeers', {
            url: '/completeBeers',
            views: {
              'menuContent': {
                templateUrl: 'templates/completeBeers.html',
                //controller: 'VerifyListCtrl'
                controller: 'VerifyListController'
              }
            }
        });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/start');
    }

    function beersPrepService(BeerService) {
      return BeerService.getBeers();
    }



})();
