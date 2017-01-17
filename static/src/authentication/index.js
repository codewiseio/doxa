import angular from 'angular';


import AuthenticationConfig from './authentication.config';
import AuthenticationController from './authentication.controller';
import AuthenticationService from './authentication.service';

// Create the home module where our functionality can attach to
let authenticationModule = angular.module('doxa.authentication', [])
    .config(AuthenticationConfig)
    .controller('AuthenticationController', AuthenticationController)
    .service('AuthenticationService', AuthenticationService );

export default authenticationModule;