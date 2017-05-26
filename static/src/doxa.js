//import 'bootstrap/dist/css/bootstrap.css';


import angular from 'angular';
import routing from './doxa.config';
import uirouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';

import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-material/angular-material.css';
import 'angular-file-upload';
import 'angular1-star-rating';

// import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
import 'roboto-npm-webfont';
import ngMessages from 'angular-messages';

import 'jquery';
import 'bootstrap-loader';

import './authentication';
import './dashboard';
import './landing-page';
import './registration';
import './organization';

import './foo';

import './directives/index';
import './filters';

require('./assets/css/paper-dashboard.css');
require('./assets/css/default.less');

/* App Dependencies */
angular.module( "doxa", [
                'ui.router',
                'ngMaterial',
                'angularFileUpload',
                'doxa.authentication',
                'doxa.dashboard',
                'doxa.landing-page',
                'doxa.registration',
                'doxa.directives',
                'doxa.filters',
                'doxa.foo',
                'doxa.organization',
                ngMessages,
                ngCookies
    ])
    .config(routing);

angular.module('doxa').run();

