//import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import routing from './doxa.config';
import uirouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';

import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-material/angular-material.css';
import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';


import './doxa.routes';
import './authentication';
import './dashboard';

import 'jquery';
import 'bootstrap-loader';


/* App Dependencies */
angular.module("doxa", [
    'ui.router',
    'ngMaterial',
    'doxa.routes',
    'doxa.authentication',
    'doxa.dashboard',
    ngCookies
]).config(routing);

angular.module('doxa').run();

