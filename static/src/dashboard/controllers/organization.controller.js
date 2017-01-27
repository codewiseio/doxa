import countryOptions from '../../assets/json/countries.json';
import organizationSizeOptions from '../../assets/json/organization.size.json';

export default class DashboardOrganizationController {
  constructor(DashboardOrganizationService, $cookies, $state, $mdToast) {
    'ngInject';
    
    this.DashboardOrganizationService = DashboardOrganizationService;
    this.$cookies = $cookies;
    this.$mdToast = $mdToast;
    
    this.title = $state.current.title;

    this.organizationSizeOptions = organizationSizeOptions;
    
    this.errors = [];
    
    this.initPage();    
  }
  
  initPage() {
    let id = JSON.parse(this.$cookies.get('organization')).id;
    
    this.DashboardOrganizationService.get(id).then(
        (response) => {
          this.organization = response.data;
          console.log(this.organization);
        },
        (err) => {
          console.log('Error fetching organization data.');
          console.log(err);
        }
    );
  }

  
}