//@require "./html/*.html"

function AuthenticationConfig($stateProvider) {
  'ngInject';

  // Define the routes
  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'AuthenticationController as $ctrl',
      templateUrl: 'authentication.login.html',
      title: 'Sign in'
    })
    .state('logout', {
      url: '/logout',
      controller: 'AuthenticationController as $ctrl',
      templateUrl: 'authentication.logout.html',
    });
    
}

export default AuthenticationConfig;