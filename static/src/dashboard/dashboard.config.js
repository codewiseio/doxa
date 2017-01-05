//import dashboardTemplate from './index.html';
//require('./nav-sidebar.html');

// @ require ".//.html"*

export default function DashboardConfig($stateProvider) {
  'ngInject';
  
  //console.log(dashboardTemplate);

  // Define the routes
  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      controller: 'DashboardController as $ctrl',
      template: 'index.html',
      title: 'Dashboard'
    });

}
