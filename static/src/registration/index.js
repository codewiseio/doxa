import angular from 'angular';

/* compare-to directive for password confirmation fields */
import 'angularjs-compare-to-directive';

// Create the home module where our functionality can attach to
import RegistrationConfig from './registration.config';
import RegistrationController from './registration.controller';
import RegistrationService from './registration.service';

// Attach UI-Router states
let registrationModule = angular.module('doxa.registration', ['compareField','doxa.directives'])
    .config(RegistrationConfig)
    .controller('RegistrationController', RegistrationController)
    .service('RegistrationService', RegistrationService );


export default registrationModule;