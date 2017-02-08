export default class DashboardMemberController {
  constructor(DashboardMemberService, $state, $stateParams, $mdToast) {
    'ngInject';
    
    this.DashboardMemberService = DashboardMemberService;
    this.$mdToast = $mdToast;
    this.$state = $state;
    
    this.context = "dashboard.member.edit";
    this.title = $state.current.title;
    
    this.item = {};

    this.errors = [];
    
    this.initPage();    
  }
  
  initPage() {
    // Get the organization ID from the user's cookie
    let id = JSON.parse(this.$cookies.get('organization')).id;
    
    // Retrieve organization data
    //this.DashboardMemberService.get(id).then(
    //    (response) => {
    //      this.organization = response.data;
    //      console.log(this.organization);
    //    },
    //    (err) => {
    //      console.log('Error fetching organization data.');
    //      console.log(err);
    //    }
    //);
    
  }
  
   /**
    * @name save
    * @description Save data for an organization
    * @returns {Promise}
    * @memberOf doxa.dashboard.services.organization
    */
  save() {
    this.DashboardMemberService.save(this.organization).then(
        (response) => {
          console.log( response.data );
          
          this.organization = response.data;
          
          // update user's cookie with current organization data
          this.$cookies.put('organization',JSON.stringify(this.organization));
          this.$state.go('dashboard.home');
        },
        (err) => {
          console.log('Error fetching organization data.');
          console.log(err);
        }
    );
  }


  
}