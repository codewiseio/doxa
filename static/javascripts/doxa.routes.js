(function() {
    'use strict';
    
    angular
        .module('doxa.routes', ['ui.router'])
        .config(config);
        
    config.$inject = ['$stateProvider','$urlRouterProvider'];
    
    /**
     * @name config
     * @desc Define valid application routes
     */
    function config($stateProvider,$urlRouterProvider) {
        //$urlRouterProvider.when('/register/', {
        //   controller: 'RegisterController',
        //   controllerAs: 'vm',
        //   templateUrl: '/static/templates/authentication/register.html'
        //}).when('/login/', {
        //    controller: 'LoginController',
        //    controllerAs: 'vm',
        //    templateUrl: '/static/templates/authentication/login.html'
        //}).when('/', {
        //    controller: 'IndexController',
        //    controllerAs: 'vm',
        //    templateUrl: '/static/templates/layout/index.html'
        
      $stateProvider
        .state('home', {
          url: '/',
          views: {
            '': {
                controller: 'IndexController',
                controllerAs: 'vm',
                templateUrl: '/static/templates/layout/index.html'
            },
         }
        }).state('register', {
            url: '/register',
            templateUrl: '/static/templates/registration/index.html',
            controller: 'RegisterController',
            controllerAs: 'vm',            
        }).state('register.account', {
            url: '/user',
            templateUrl: '/static/templates/registration/account.html?v=3',           
        }).state('register.organization', {
            url: '/organization',
            templateUrl: '/static/templates/registration/organization.html?v=3',           
        }).state('register.tier', {
            url: '/tier',
            templateUrl: '/static/templates/registration/tier.html',           
        })
        
        .state('login', {
            url: '/login',
            views: {
                '': {
                    templateUrl: '/static/templates/authentication/login.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                }
            }
        });
        $urlRouterProvider.otherwise('/');
    }
})();
























