import AuthenticationService from './authentication.service';

class AuthenticationController {
  constructor(AuthenticationService, $state, $location) {
    'ngInject';
    
    this.AuthenticationService = AuthenticationService;
    this.$location = $location;
    
    this.title = $state.current.title;
    this.authType = $state.current.name.replace('app.', '');
    this.username = null;
    this.passowrd = null;    
    this.errors = [];
    
    // If the user is authenticated, they should not be here.
    if ($state.current.name != "logout" && AuthenticationService.isAuthenticated()) {
        $location.url('/dashboard');
    }
    
    // Process logout request
    if ( $state.current.name == "logout" ) {
      this.AuthenticationService.logout();
    }
  }

  login () {
      this.isSubmitting = true;
      this.AuthenticationService.login(this.username, this.password)
        .then(
          (res) => {
            console.log('Succes');
            console.log(res);
            this.$location.url('/dashboard');
          },
          (err) => {
            console.log('Fail');
            console.log(err);
            this.errors.push(err.data.detail);
          }
        );
      console.log(this.username);
      console.log(this.password);
  }
}


export default AuthenticationController;