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
      $stateProvider
        .state('home', {
          url: '/',
          views: {
            '': {
                controller: 'IndexController',
                controllerAs: 'vm',
                templateUrl: '/static/templates/layout/landing-page/index.html'
            },
            //'appbar': {
            //    templateUrl: '/static/templates/layout/landing-page/navbar.html'
            //}
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
        })
        .state('dashboard', {
            url: '/dashboard',
            views: {
                '': {
                    templateUrl: '/static/templates/layout/dashboard.html?v=4',
                    //controller: 'OrganizationController',
                    //controllerAs: 'vm'
                },
                'appbar': {
                    templateUrl: '/static/templates/layout/dashboard/appbar.html'
                },
                'sidebar': {
                    templateUrl: '/static/templates/layout/dashboard/nav-sidebar.html'
                }
            }
        })
        .state('dashboard.editOrganization', {
            url: '/organization/edit',
            views: {
                '': {
                    templateUrl: '/static/templates/organization/edit.html?v=3'
                }
            }
        });
        $urlRouterProvider.otherwise('/');
    }
})();
























