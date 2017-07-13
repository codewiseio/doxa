//import countryOptions from '../../assets/json/formOptions/countries.json';
import organizationSizeOptions from '../../assets/json/formOptions/organization.size.json';

export default class DashboardOrganizationController {
  constructor(DashboardOrganizationService, AppDataService, $cookies, $state, $mdToast) {
    'ngInject';
    
    this.DashboardOrganizationService = DashboardOrganizationService;
    this.AppDataService = AppDataService;
    this.$cookies = $cookies;
    this.$mdToast = $mdToast;
    this.$state = $state;
    
    this.context = "dashboard.organization.edit";

    this.organizationSizeOptions = organizationSizeOptions;
    
    this.errors = [];
    
    this.initPage();    
  }
  
  initPage() {
    // Get the organization ID from the user's cookie
    let id = JSON.parse(this.$cookies.get('organization')).id;
    
    // Retrieve organization data
    this.DashboardOrganizationService.get(id).then(
        (response) => {
          this.organization = response.data;
          this.AppDataService.pageTitle = this.organization.title;
        },
        (err) => {
          console.log(err);
          var toast = this.$mdToast.simple()
            .textContent(error.data.message)
            .position('top right')
            .parent();
          this.$mdToast.show(toast);
        }
    );
    
  }
  
   /**
    * @name save
    * @description Save data for an organization
    * @returns {Promise}
    * @memberOf doxa.dashboard.services.organization
    */
  save() {
    this.DashboardOrganizationService.save(this.organization).then(
        (response) => {
          console.log( response.data );
          
          this.organization = response.data;
          
          // update user's cookie with current organization data
          this.$cookies.put('organization',JSON.stringify(this.organization));
          this.$state.go('dashboard.home');
          
          // notify the user operation successful
          var toast = this.$mdToast.simple()
            .textContent('Changes saved')
            .position('top right')
            .parent();
          this.$mdToast.show(toast);
        },
        (err) => {
          console.log('Error saving organization data.');
          console.log(err);
          
          // notify the user operation failed
          var toast = this.$mdToast.simple()
            .textContent('Error saving data')
            .position('top right')
            .parent();
          this.$mdToast.show(toast);
        }
    );
  }

  

  
}