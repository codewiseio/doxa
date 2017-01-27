import angular from 'angular';

import DashboardConfig from './dashboard.config';

import DashboardController from './dashboard.controller';
import DashboardAppbarController from './controllers/appbar.controller';
import DashboardOrganizationController from './controllers/organization.controller';
import SidenavController from './controllers/sidenav.controller';

import DashboardOrganizationService from './services/organization.service';

let dashboardModule = angular.module('doxa.dashboard', [])
    .config(DashboardConfig)
    .controller('DashboardController', DashboardController)
    .controller('DashboardAppbarController',DashboardAppbarController)
    .controller('DashboardOrganizationController',DashboardOrganizationController)
    .controller('SidenavController', SidenavController )
    .service('DashboardOrganizationService',DashboardOrganizationService);

export default dashboardModule;