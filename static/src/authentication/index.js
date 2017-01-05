import angular from 'angular';


import AuthenticationConfig from './authentication.config';
import AuthenticationController from './authentication.controller';
import AuthenticationService from './authentication.service';

// Create the home module where our functionality can attach to
let authenticationModule = angular.module('doxa.authentication', [])
    .config(AuthenticationConfig)
    .controller('AuthenticationController', AuthenticationController)
    .service('AuthenticationService', AuthenticationService );
    
// Create the module where our functionality can attach to
//let servicesModule = angular.module('app.services', []);
//servicesModule.service('User', UserService);



export default authenticationModule;