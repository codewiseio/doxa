import angular from 'angular';

// Create the home module where our functionality can attach to
let dashboardModule = angular.module('doxa.dashboard', []);

// Attach UI-Router states
import DashboardConfig from './dashboard.config';
dashboardModule.config(DashboardConfig);

// Attach controllers
import DashboardController from './dashboard.controller';
dashboardModule.controller('DashboardController', DashboardController);

export default dashboardModule;