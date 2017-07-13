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
          '': { 
            controller: 'DashboardHomeController as $ctrl',
            templateUrl: 'dashboard.home.html' 
          }
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
            templateUrl: 'dashboard.member.edit.html',
            controller: 'DashboardMemberController as $ctrl',
          }
        }
      })
      .state('dashboard.groups', {
        url: '/groups',
        title: 'Groups',
        views : {
          'appbar': {
            templateUrl: 'dashboard.appbar.html',
            controller: 'DashboardAppbarController as $ctrl',
          },
          '': {
            templateUrl: 'dashboard.groups.html',
            controller: 'DashboardGroupsController as $ctrl',
          }
        },
      })
      .state('dashboard.newGroup', {
        url: '/group',
        title: 'New Group',
        views : {
          'appbar': {
            templateUrl: 'form.appbar.html',
            controller: 'DashboardAppbarController as $ctrl',
          },
          '': {
            templateUrl: 'dashboard.group.edit.html',
            controller: 'DashboardGroupController as $ctrl',
          }
        }
      })
      .state('dashboard.editGroup', {
        url: '/group/:id/edit',
        title: 'Group',
        views : {
          'appbar': {
            templateUrl: 'form.appbar.html',
            controller: 'DashboardAppbarController as $ctrl',
          },
          '': {
            templateUrl: 'dashboard.group.edit.html',
            controller: 'DashboardGroupController as $ctrl',
          }
        }
      })
      .state('dashboard.group', {
        url: '/group/:id',
        title: 'Group',
        views : {
          'appbar': {
            templateUrl: 'dashboard.appbar.html',
            controller: 'DashboardAppbarController as $ctrl',
          },
          '': {
            templateUrl: 'dashboard.group.view.html',
            controller: 'DashboardGroupController as $ctrl',
          }
        }
      })
      .state('dashboard.groupMembers', {
        url: '/group/:id/members',
        title: 'Group Members',
        views : {
          'appbar': {
            templateUrl: 'dashboard.appbar.html',
            controller: 'DashboardAppbarController as $ctrl',
          },
          '': {
            templateUrl: 'dashboard.group.members.html',
            controller: 'DashboardGroupMembersController as $ctrl',
          }
        }
      })
      ;

    /**
     *  Set the dashboard them colors
     * */
    $mdThemingProvider.theme('default')
      .primaryPalette('purple', {'default': '300'})
      .accentPalette('amber');

    // $mdThemingProvider.theme('grey')
    //   .primaryPalette('grey', {'default': '100'})
    //   .accentPalette('light-blue');
}
