import angular from 'angular';


// Create the home module where our functionality can attach to
let dashboardModule = angular.module('doxa.dashboard', []);

// Attach UI-Router states
import DashboardConfig from './dashboard.config';
dashboardModule.config(DashboardConfig);

// Attach controllers
import DashboardController from './dashboard.controller';
dashboardModule.controller('DashboardController', DashboardController);

import AppbarController from './controllers/appbar.controller';
dashboardModule.controller('AppbarController',AppbarController);

import SidenavController from './controllers/sidenav.controller';
dashboardModule.controller('SidenavController', SidenavController );

export default dashboardModule;