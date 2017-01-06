function AuthenticationConfig($stateProvider, $httpProvider) {
  'ngInject';

  // Define the routes
  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'AuthenticationController as $ctrl',
      template: require('raw!./login.html'),
      title: 'Sign in'
    });
    
}

export default AuthenticationConfig;