import angular from 'angular';


// Create the home module where our functionality can attach to
let registrationModule = angular.module('doxa.registration', []);

// Attach UI-Router states
import RegistrationConfig from './registration.config';
registrationModule.config(RegistrationConfig);

// Attach controllers
import RegistrationController from './registration.controller';
registrationModule.controller('RegistrationController', RegistrationController);


export default registrationModule;