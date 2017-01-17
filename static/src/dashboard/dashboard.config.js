//@require "./html/*.html"
require('../assets/css/dashboard.less');

export default function DashboardConfig($stateProvider, $mdThemingProvider) {
  'ngInject';
  
    // Define the routes
    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        controller: 'DashboardController as $ctrl',
        templateUrl: 'dashboard.index.html',
        abstract: true,
      })
      .state('dashboard.home',  {
        url: '',
        templateUrl: 'dashboard.home.html',
      });

    /**
     *  Set the dashboard them colors
     * */
    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('pink');
      
   // /* Configure icons */
   // TODO: CONFIGURE ICONS
   //$mdIconProvider
   //   .defaultIconSet("./assets/svg/avatars.svg", 128)
   //   .icon("menu", "./assets/svg/menu.svg", 24)
   //   .icon("share", "./assets/svg/share.svg", 24)
   //   .icon("google_plus", "./assets/svg/google_plus.svg", 24)
   //   .icon("hangouts", "./assets/svg/hangouts.svg", 24)
   //   .icon("twitter", "./assets/svg/twitter.svg", 24)
   //   .icon("phone", "./assets/svg/phone.svg", 24);
}
