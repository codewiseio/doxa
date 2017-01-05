routing.$inject = ['$urlRouterProvider', '$locationProvider','$httpProvider'];

export default function routing($urlRouterProvider, $locationProvider, $httpProvider ) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $locationProvider.hashPrefix('!');
  
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}
