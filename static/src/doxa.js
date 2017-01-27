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
import ngMessages from 'angular-messages';

import 'jquery';
import 'bootstrap-loader';

import './authentication';
import './dashboard';
import './landing-page';
import './registration';

import './directives/index';

/* App Dependencies */
angular.module( "doxa", [
                'ui.router',
                'ngMaterial',
                'doxa.authentication',
                'doxa.dashboard',
                'doxa.landing-page',
                'doxa.registration',
                'doxa.directives',
                ngMessages,
                ngCookies
    ])
    .config(routing);

angular.module('doxa').run();

