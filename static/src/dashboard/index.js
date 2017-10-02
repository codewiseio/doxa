import angular from 'angular';

import DashboardConfig from './dashboard.config';

import UserController from './controllers/user.controller'

import DashboardController from './dashboard.controller';
import DashboardAppbarController from './controllers/appbar.controller';

import DashboardHomeController from './controllers/home.controller';



import SidenavController from './controllers/sidenav.controller';


let dashboardModule = angular.module('doxa.dashboard', [])
    .config(DashboardConfig)
    .controller('DashboardController', DashboardController)
    .controller('DashboardAppbarController',DashboardAppbarController)





    .controller('DashboardHomeController', DashboardHomeController)
    .controller('UserController', UserController)  
    .controller('SidenavController', SidenavController )
    




export default dashboardModule;