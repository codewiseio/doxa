import angular from 'angular';

import DashboardConfig from './dashboard.config';

import UserController from './controllers/user.controller'
import UserService from './services/user.service';
import DashboardController from './dashboard.controller';
import DashboardAppbarController from './controllers/appbar.controller';
import DashboardGroupsController from './controllers/groups.controller';
import DashboardGroupEditDialogController from './controllers/group.edit.dialog.controller.js';
import DashboardGroupEditMemberController from './controllers/group.member.edit.controller.js';
import DashboardGroupController from './controllers/group.controller';
import DashboardGroupMembersController from './controllers/group.members.controller';
import DashboardGroupAddMembersController from './controllers/group.add.members';
import DashboardHomeController from './controllers/home.controller';
import AppDataService from './services/appdata.service';

import DashboardMemberController from './controllers/member.controller';
import DashboardMemberDialogController from './controllers/member.dialog.controller';
import DashboardMembersController from './controllers/members.controller';
import DashboardOrganizationController from './controllers/organization.controller';
import SidenavController from './controllers/sidenav.controller';

import DashboardOrganizationService from './services/organization.service';
import DashboardMemberService from './services/member.service';
import GroupService from './services/group.service';


import EventService from './services/event.service';
import EventsController from './controllers/events.controller';
import EventEditDialogController from './controllers/event.edit.dialog.controller';

let dashboardModule = angular.module('doxa.dashboard', [])
    .config(DashboardConfig)
    .controller('DashboardController', DashboardController)
    .controller('DashboardAppbarController',DashboardAppbarController)
    .controller('DashboardMemberController',DashboardMemberController)
    .controller('DashboardMemberDialogController', DashboardMemberDialogController)
    .controller('DashboardMembersController',DashboardMembersController)
    .controller('DashboardOrganizationController',DashboardOrganizationController)

    .controller('DashboardGroupController', DashboardGroupController )
    .controller('DashboardGroupEditDialogController', DashboardGroupEditDialogController )
    .controller('DashboardGroupsController', DashboardGroupsController )

    .controller('DashboardGroupMembersController', DashboardGroupMembersController)
    .controller('DashboardGroupAddMembersController', DashboardGroupAddMembersController)
    .controller('DashboardGroupEditMemberController', DashboardGroupEditMemberController)
    .controller('DashboardHomeController', DashboardHomeController)
    .controller('UserController', UserController)  
    .controller('SidenavController', SidenavController )

    .service('AppDataService', AppDataService )
    .service('DashboardMemberService',DashboardMemberService)
    .service('DashboardOrganizationService',DashboardOrganizationService)

    /* Events */
    .service('EventService', EventService)
    .controller('EventsController', EventsController)
    .controller('EventEditDialogController', EventEditDialogController)

    .service('GroupService', GroupService)
    .service('UserService',UserService)

export default dashboardModule;