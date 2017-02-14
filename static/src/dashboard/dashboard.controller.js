class DashboardController {
  constructor(AuthenticationService, $state, $location) {
    'ngInject';

    
    // If the user is not authenticated they should not be here
    if (! AuthenticationService.isAuthenticated()) {
        $location.url('/login');
    }
  
  }

}


export default DashboardController;