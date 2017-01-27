import countryOptions from '../assets/json/countries.json';
import organizationSizeOptions from '../assets/json/organization.size.json';

class RegistrationController {
  constructor(AuthenticationService, RegistrationService, $state, $timeout, $location, $q, $rootScope, $mdToast) {
    'ngInject';
    
    this.RegistrationService = RegistrationService;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;
    this.$q = $q;
    this.$mdToast = $mdToast;
    
    this.title = $state.current.title;
    this.countryOptions = countryOptions;
    this.countrySelectedItem  = null;
    this.countrySearchText    = null;
    
    this.organizationSizeOptions = organizationSizeOptions;
    
    this.errors = [];
    
    //this.user = {};
    //this.organization = {};
    this.formData = {};
    
    // If the user is authenticated they should not be here
    if (AuthenticationService.isAuthenticated()) {
        $location.url('/dashboard');
    }
  }
  
  /*
   * Search through list of countries
   * */
  querySearch(query) {
    console.log(query);
    // create filter
    var lowercaseQuery = angular.lowercase(query);
    console.log(query);
    console.log(lowercaseQuery);
    var filter = function filterFn(item) {
      return item.display.toLowerCase().indexOf(lowercaseQuery) >= 0;
    };
    var results = query ? this.countryOptions.filter( filter ) : this.countryOptions;

    return new Promise ( function(resolve,reject) {
      resolve(results);
      console.log(results);
    });
  }

  countrySelectedItemChange(item) {
    this.formData.country = item.value;
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
      this.RegistrationService.registerOrganization(this.formData)
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


export default RegistrationController;