//@require "./html/*.html"

export default function RegistrationConfig($stateProvider) {
  'ngInject';
  
  // Define the routes
  $stateProvider
    .state('register', {
      url: '/register',
      controller: 'RegistrationController as $ctrl',
      templateUrl: 'register.index.html',
    });
}
