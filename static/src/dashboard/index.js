import angular from 'angular';

import DashboardConfig from './dashboard.config';

import DashboardController from './dashboard.controller';
import DashboardAppbarController from './controllers/appbar.controller';
import AppDataService from './services/appdata.service';
import DashboardMemberController from './controllers/member.controller';
import DashboardMembersController from './controllers/members.controller';
import DashboardOrganizationController from './controllers/organization.controller';
import SidenavController from './controllers/sidenav.controller';

import DashboardOrganizationService from './services/organization.service';
import DashboardMemberService from './services/member.service';

let dashboardModule = angular.module('doxa.dashboard', [])
    .config(DashboardConfig)
    .controller('DashboardController', DashboardController)
    .controller('DashboardAppbarController',DashboardAppbarController)
    .controller('DashboardMemberController',DashboardMemberController)
    .controller('DashboardMembersController',DashboardMembersController)
    .controller('DashboardOrganizationController',DashboardOrganizationController)
    .controller('SidenavController', SidenavController )
    .service('AppDataService', AppDataService )
    .service('DashboardMemberService',DashboardMemberService)
    .service('DashboardOrganizationService',DashboardOrganizationService);

export default dashboardModule;