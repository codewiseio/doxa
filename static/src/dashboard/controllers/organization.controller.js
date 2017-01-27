import countryOptions from '../../assets/json/countries.json';
import organizationSizeOptions from '../../assets/json/organization.size.json';

export default class DashboardOrganizationController {
  constructor(DashboardOrganizationService, $cookies, $state, $mdToast) {
    'ngInject';
    
    this.DashboardOrganizationService = DashboardOrganizationService;
    this.$cookies = $cookies;
    this.$mdToast = $mdToast;
    
    this.title = $state.current.title;
    this.countryOptions = countryOptions;
    this.countrySelectedItem  = null;
    this.countrySearchText    = null;
    
    this.organizationSizeOptions = organizationSizeOptions;
    
    this.errors = [];
    
    this.initPage();    
  }
  
  initPage() {
    let id = JSON.parse(this.$cookies.get('organization')).id;
    
    this.DashboardOrganizationService.get(id).then(
        (response) => {
          this.organization = response.data;
        },
        (err) => {
          console.log('Error fetching organization data.');
          console.log(err);
        }
    );
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
  

  
}