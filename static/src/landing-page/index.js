import angular from 'angular';


// Create the home module where our functionality can attach to
let landingPageModule = angular.module('doxa.landing-page', []);

// Attach UI-Router states
import LandingPageConfig from './landing-page.config';
landingPageModule.config(LandingPageConfig);

// Attach controllers
import LandingPageController from './landing-page.controller';
landingPageModule.controller('LandingPageController', LandingPageController);

export default landingPageModule;