@require "./html/*.html"


require("../assets/js/doxa.js");
require("../assets/js/bootstrap-notify.js");
require("../assets/js/material.min.js");
require("../assets/js/material-dashboard.js");

require("../assets/js/jquery.select-bootstrap.js");
require("../assets/js/bootstrap-datetimepicker.js");
require("../assets/js/jquery.dropdown.js");


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
            controller: 'MembersController as $ctrl',
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
            controller: 'GroupController as $ctrl',
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
            controller: 'GroupsController as $ctrl',
          }
        },
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
            controller: 'GroupMembersController as $ctrl',
          }
        }
      })
      .state('dashboard.event', {
          url: '/event/:id',
          title: 'Event',
          views : {
            'appbar': {
              templateUrl: 'dashboard.appbar.html',
              controller: 'DashboardAppbarController as $ctrl',
            },
            '': {
              templateUrl: 'event.html',
              controller: 'EventController as $ctrl',
            }
          }
      })
      .state('dashboard.events', {
          url: '/events',
          title: 'Events',
          views : {
            '': {
              templateUrl: 'dashboard.events.html',
              controller: 'EventsController as $ctrl',
            }
          }
      })
      .state('dashboard.tasks', {
        url: '/tasks',
        title: 'Tasks',
        views: {
            '': {
              templateUrl: 'tasks.html',
              controller: 'TasksController as $ctrl',
            }
        }
      });
      // .state('dashboard.event', {
      //   url: '/event/:id/members',
      //   title: 'Event Members',
      //   views : {
      //     'appbar': {
      //       templateUrl: 'dashboard.appbar.html',
      //       controller: 'DashboardAppbarController as $ctrl',
      //     },
      //     '': {
      //       templateUrl: 'event.members.html',
      //       controller: 'EventMembersController as $ctrl',
      //     }
      //   }
      // });


      ;

    /**
     *  Set the dashboard them colors
     * */
    $mdThemingProvider.theme('default')
      .primaryPalette('purple', {'default': '500'})
      .accentPalette('amber');

    // $mdThemingProvider.theme('grey')
    //   .primaryPalette('grey', {'default': '100'})
    //   .accentPalette('light-blue');
}
