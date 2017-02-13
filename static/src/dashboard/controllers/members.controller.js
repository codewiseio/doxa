export default class DashboardMemberController {
  constructor(DashboardMemberService, $cookies, $state, $stateParams, $mdToast) {
    'ngInject';
    
    this.DashboardMemberService = DashboardMemberService;
    this.$mdToast = $mdToast;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    
    this.context = "dashboard.members";
    this.errors = [];

    console.log('DashboardMembersController');
    
    this.initPage();    
  }
  
  initPage() {

    // get currently set organization
    this.organization = JSON.parse(this.$cookies.get('organization'));
    this.organization.moniker = 'organization:'+this.organization.id;
    console.log(this.organization.moniker);

    let id = this.$stateParams.id;

    // Retrieve record data
    this.DashboardMemberService.list( this.organization.moniker ).then(
        (response) => {
          console.log(response);
          this.items = response.data;
          console.log(this.data);
        },
        (err) => {
          console.log('Error fetching data.');
          console.log(err);

          var toast = this.$mdToast.simple()
            .textContent(error.data.message)
            .position('top right')
            .parent();

          this.$mdToast.show(toast);
        }
    );   


  }
  
}