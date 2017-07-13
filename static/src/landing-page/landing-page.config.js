//@require "./html/*.html"
require('../assets/css/landing-page.less');

export default function LandingPageConfig($stateProvider) {
  'ngInject';
  
    // Define the routes
    $stateProvider
      .state('landing', {
        url: '/',
        controller: 'LandingPageController as $ctrl',
        templateUrl: 'landing-page.index.html',
        abstract: true
      })
      .state('landing.home', {
        url: '',
        templateUrl: 'landing-page.home.html'
      });
}


