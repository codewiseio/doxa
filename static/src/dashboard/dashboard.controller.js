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
  
  }
  
/**
  * @name registerOrganiationAndAccountOwner
  * @desc Register a new organization and account owner
  * @returns {Promise}
  * @memberOf doxa.registration.controller
  */  
  registerOrganization(isValid) {
    if ( isValid )
    {
      console.log('Registering...')
      this.RegistrationService.registerOrganization(this.organization, this.user)
        .then(
            (response) => {
                console.log('Successfully registered user.');
                console.log(response);
                
                  var toast = this.$mdToast.simple()
                    .textContent('Registration successful.')
                    .position('top right')
                    .parent();
                  
                  this.$mdToast.show(toast);
            },
            (error) => {
                console.log('Registration error:'  );
                console.log(error);
                
                if ( error.data ) {
                  var toast = this.$mdToast.simple()
                    .textContent(error.data.message)
                    .position('top right')
                    .parent();
                    
                  if ( error.data['message-token'] == 'conflict-email' ) {
                    toast.action('RESET YOUR PASSWORD?')
                    .highlightAction(true)
                    .highlightClass('md-accent');
                  }
                  this.$mdToast.show(toast);
                }
                else {
                  var toast = this.$mdToast.simple()
                    .textContent('Could not connect to server. (Fix me)')
                    .position('top right')
                    .parent();
                  
                  this.$mdToast.show(toast);
                }
                
                

                  
                
            }
        );
    }
  }
}


export default DashboardController;