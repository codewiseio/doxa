//@require "./html/*.html"

export default function OrganizationConfig($stateProvider) {
  'ngInject';
  
  // Define the routes
  $stateProvider
    .state('organization', {
      url: '/o/:slug',
      controller: 'OrganizationController as $ctrl',
      templateUrl: 'organization.profile.html',
    });
}
