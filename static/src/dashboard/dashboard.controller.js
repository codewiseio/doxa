class DashboardController {
  constructor(AuthenticationService, $cookies, $rootScope, $state) {
    'ngInject';

    
    // If the user is not authenticated they should not be here
    if (! AuthenticationService.isAuthenticated()) {
        $state.go('login');
    }

    // Get the active organization using cookie
    $rootScope.organization = JSON.parse($cookies.get('organization'));
  }

}


export default DashboardController;