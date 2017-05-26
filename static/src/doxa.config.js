routing.$inject = ['$urlRouterProvider', '$locationProvider','$httpProvider', '$stateProvider'];

export default function routing($urlRouterProvider, $locationProvider, $httpProvider, $stateProvider ) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $locationProvider.hashPrefix('!');

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

  $stateProvider
    .state('404', {
      templateUrl: '404.html',
    });

  
  
}
