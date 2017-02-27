//@require "./html/*.html"
require('../assets/css/default.less');
require('../assets/css/dashboard.less');
require('../common/html/form.appbar.html');

export default function DashboardConfig($stateProvider, $mdThemingProvider) {
  'ngInject';
  
    // Define the routes
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        controller: 'DashboardController as $ctrl',
        templateUrl: 'dashboard.index.html',
        abstract: true,
      })
      .state('dashboard.home',  {
        url: '',
        //templateUrl: 'dashboard.home.html',
        views : {
          'appbar': {
            controller: 'DashboardAppbarController as $ctrl',
            templateUrl: 'dashboard.appbar.html'
          },
          '': { templateUrl: 'dashboard.home.html' }
        }
      })
      .state('dashboard.organization', {
        url: '/organization',
        title: 'Edit organization',
        views : {
          'appbar': {
            templateUrl: 'form.appbar.html',
            controller: 'DashboardAppbarController as $ctrl',
          },
          '': {
            templateUrl: 'dashboard.organization.html',
            controller: 'DashboardOrganizationController as $ctrl',
          }
        }
      })
      .state('dashboard.members', {
        url: '/members',
        title: 'Members',
        views : {
          'appbar': {
            templateUrl: 'dashboard.appbar.html',
            controller: 'DashboardAppbarController as $ctrl',
          },
          '': {
            templateUrl: 'dashboard.members.html',
            controller: 'DashboardMembersController as $ctrl',
          }
        }
      })
      .state('dashboard.member', {
        url: '/member/:id',
        title: 'Edit Member',
        views : {
          'appbar': {
            templateUrl: 'form.appbar.html',
            controller: 'DashboardAppbarController as $ctrl',
          },
          '': {
            templateUrl: 'dashboard.member.html',
            controller: 'DashboardMemberController as $ctrl',
          }
        }
      });

    /**
     *  Set the dashboard them colors
     * */
    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('pink');

    $mdThemingProvider.theme('grey')
      .primaryPalette('grey', {'default': '100'})
      .accentPalette('light-blue');
      
   // /* Configure icons */
   // TODO: CONFIGURE ICONS
   //$mdIconProvider
   //   .defaultIconSet("./assets/svg/avatars.svg", 128)
   //   .icon("menu", "./assets/svg/menu.svg", 24)
   //   .icon("share", "./assets/svg/share.svg", 24)
   //   .icon("google_plus", "./assets/svg/google_plus.svg", 24)
   //   .icon("hangouts", "./assets/svg/hangouts.svg", 24)
   //   .icon("twitter", "./assets/svg/twitter.svg", 24)
   //   .icon("phone", "./assets/svg/phone.svg", 24);
}
