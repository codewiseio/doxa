class RegistrationController {
  constructor(AuthenticationService, $state, $location) {
    'ngInject';
    
    this.title = $state.current.title;    
    this.errors = [];
    
    // If the user is authenticated they should not be here
    if (AuthenticationService.isAuthenticated()) {
        $location.url('/dashboard');
    }
  }
}


export default RegistrationController;