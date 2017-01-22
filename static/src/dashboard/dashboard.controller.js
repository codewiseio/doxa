class DashboardController {
  constructor(AuthenticationService, $state, $location, $window, $cookies) {
    'ngInject';
    
    this.title = $state.current.title;    
    this.errors = [];
    this.$cookies = $cookies;
    
    // If the user is not authenticated they should not be here
    if (! AuthenticationService.isAuthenticated()) {
        $location.url('/login');
    }
    
    // If the user is authenticated, load the organization from the session
    console.log( this.$cookies.get('organization') );
  }
}


export default DashboardController;