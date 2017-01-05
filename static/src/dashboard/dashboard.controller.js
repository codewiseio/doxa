class DashboardController {
  constructor(AuthenticationService, $state, $location) {
    'ngInject';
    
    this.title = $state.current.title;    
    this.errors = [];
    
    // If the user is not authenticated they should not be here
    if (! AuthenticationService.isAuthenticated()) {
        $location.url('/login');
    }
  }
}


export default DashboardController;