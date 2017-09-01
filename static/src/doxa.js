//import 'bootstrap/dist/css/bootstrap.css';


import angular from 'angular';
import routing from './doxa.config';
import uirouter from 'angular-ui-router';
import ngCookies from 'angular-cookies';

import 'arrive';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import 'angular-material/angular-material.css';
import 'angular-file-upload';
import 'angular1-star-rating';
import 'angular-material-picker';
import relativeDate from 'angular-relative-date'
import 'moment';
import 'ng-material-datetimepicker';
import 'ng-material-datetimepicker/css/material-datetimepicker.css';

// import 'roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss';
// import 'roboto-npm-webfont';
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


// import 'angular-sweetalert-2/dist/angular-sweetalert2.min.js';
// require('sweetalert2/dist/sweetalert2.min.css')
require('./assets/css/default.less');

import './common/sweetalert';



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
                'ngMaterialDatePicker',
                'SweetAlert',
                // 'socialbase.sweetAlert',
                ngMessages,
                ngCookies,
                'relativeDate'
    ])
    .config(routing);

angular.module('doxa').run();

