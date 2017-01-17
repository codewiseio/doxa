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
    
    this.user = {};
    this.organization = {};
    
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
                console.log('Successfully registered user');
                console.log(response);
            },
            (error) => {
                console.log('Error registering user'  );
                console.log(error);
                
                  var toast = this.$mdToast.simple()
                    .textContent(error.data.message)
                    .action('RESET PASSWORD')
                    .highlightAction(true)
                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                    .position('top right')
                    .parent();
                    
                  this.$mdToast.show(toast);
            }
        );
    }
  }
  
  /**
  * @name submitForm
  * @desc Submits a given form using the form id
  * @param {object} id The user data entered by the user
  * @returns {Promise}
  * @memberOf doxa.registration.controller
  */
  submitForm(id="signup-form") {
    this.$rootScope.$broadcast('submit-form',{'id':'signup-form'} );
  }
  
}


export default RegistrationController;