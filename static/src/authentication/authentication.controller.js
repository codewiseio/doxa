import AuthenticationService from './authentication.service';

class AuthenticationController {
  constructor(AuthenticationService, $state, $location, $mdDialog) {
    'ngInject';
    
    this.AuthenticationService = AuthenticationService;
    this.$location = $location;
    this.$mdDialog = $mdDialog;
    
    this.title = $state.current.title;
    this.authType = $state.current.name.replace('app.', '');
    this.email = null;
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
      this.AuthenticationService.login(this.email, this.password)
        .then(
          (res) => {
            console.log('Succes');
            console.log(res);
            this.$location.url('/dashboard');
          },
          (err) => {
            console.log('Fail');
            console.log(err);
            this.errors.push(err);
            this.displayError(err);
          }
        );
      console.log(this.email);
      console.log(this.password);
  }
  
  displayError(error) {
    console.log("Displaying Error");
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


export default AuthenticationController;