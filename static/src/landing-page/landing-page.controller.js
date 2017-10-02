export default class LandingPageController {
  constructor(AuthenticationService, $state, $location, $mdDialog) {
    'ngInject';
    
    this.AuthenticationService = AuthenticationService;
    this.$location = $location;
    this.$mdDialog = $mdDialog;
    
    this.title = $state.current.title;
    this.authType = $state.current.name.replace('app.', '');  
    this.errors = [];

    this.credentials = {};
    
    // If the user is authenticated, they should not be here.
    if ($state.current.name != "logout" && AuthenticationService.isAuthenticated()) {
        $location.url('/dashboard');
    }
    
    // Process logout request
    if ( $state.current.name == "logout" ) {
      this.AuthenticationService.logout();
    }

    console.log('Login controller.');
    
  }

  signin () {

      console.log('Submitting');

      this.isSubmitting = true;
      console.log(this.signinData);
      this.AuthenticationService.login(this.credentials.email, this.credentials.password)
        .then(
          (res) => {
            this.$location.url('/dashboard');
          },
          (err) => {
            this.errors.push(err);
            this.displayError(err);
          }
        );
  }

  
  displayError(error) {
    var title;
    var message;
    if ( typeof error.data == "string" ) {
      title = "Error";
      message = error.data;
    }
    else {
      title = error.data.title;
      message = error.data.message;
    }
    
    
    this.$mdDialog.show(
        this.$mdDialog.alert()
          .clickOutsideToClose(true)
          .title(title)
          .textContent(message)
          .ariaLabel('Error')
          .ok('Ok')
          // Or you can specify the rect to do the transition from
          .openFrom('#left')
          .closeTo('#right')
      );
  }
}


