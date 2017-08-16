import personTitleOptions from '../../assets/json/formOptions/person.title.json';

export default class DashboardMemberController {
  constructor(DashboardMemberService, AppDataService, $cookies, $state, $stateParams, $mdToast) {
    'ngInject';
    
    this.DashboardMemberService = DashboardMemberService;
    this.AppDataService = AppDataService
    this.$mdToast = $mdToast;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    
    this.personTitleOptions = personTitleOptions;
    this.memberRoleOptions = memberRoleOptions;
    
    this.context = "dashboard.member.edit";
    this.errors = [];
    
    this.initPage();    
  }
  
  initPage() {
    this.organization = JSON.parse(this.$cookies.get('organization'));

    let id = this.$stateParams.id;
    if ( id && id != "new" ) {

      // Retrieve record data
      this.DashboardMemberService.get(id).then(
          (response) => {
            this.data = response.data;
            this.AppDataService.pageTitle = `${this.data.entity.first_name} ${this.data.entity.last_name}`;
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
    else {
      this.AppDataService.pageTitle = `New member`;
      this.data = {
        "member": {
          "join_date": new Date(),
        },
        "contacts": [
          { "primary":true,"kind":"email"},
          { "primary":true,"kind":"telephone"},
          { "primary":true,"kind":"postaddress"},
        ]
      };
    }

    
  }
  
   /**
    * @name save
    * @description Save data for an organization
    * @returns {Promise}
    * @memberOf doxa.dashboard.services.organization
    */
  save() {

    this.data.owner = this.organization;
    console.log('Saving');

    this.DashboardMemberService.save(this.data).then(
        (response) => {          
          this.item = response.data;
          this.$state.go('dashboard.members');
          console.log('Saved');
        },
        (err) => {
          console.log('Error saving member data.');
          console.log(err);
        }
    );
  }


  
}