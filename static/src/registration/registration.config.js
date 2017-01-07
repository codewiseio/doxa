//@require "./html/*.html"

export default function RegistrationConfig($stateProvider) {
  'ngInject';
  
  // Define the routes
  $stateProvider
    .state('register', {
      url: '/register',
      controller: 'RegistrationController as $ctrl',
      templateUrl: 'index.html',
      abstract: true,
    })
    .state('register.account', {
        url: '/account',
        templateUrl: 'account.html',           
    }).state('register.organization', {
        url: '',
        templateUrl: 'organization.html',           
    }).state('register.tier', {
        url: '/tier',
        templateUrl: 'tier.html',           
    });
}
