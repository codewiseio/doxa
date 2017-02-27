export default class DashboardMemberDialogController {
  
  constructor(DashboardMemberService, $cookies, $mdDialog, $rootScope, $state, $stateParams, $mdToast, item) {
    'ngInject';
    
    this.DashboardMemberService = DashboardMemberService;

    this.$mdToast = $mdToast;
    this.$rootScope = $rootScope;
    this.$mdDialog = $mdDialog;
    
    // this.personTitleOptions = personTitleOptions;
    
    this.context = "dashboard.member";
    this.item = item;
    console.log('Dialog');
    console.log(item);
  }
  
  /**
   * Close the dialog without making changes.
   */
  cancel() {
    this.$mdDialog.cancel();
  }



  /**
   * Save changes to the item
   */
  save() {
    this.data.owner = this.$rootScope.organization;
    console.log(this.data);

    return this.DashboardMemberService.save(this.data).then(
        (response) => {          
          this.item = response.data;
          this.$mdDialog.hide();

          // notify the user operation failed
          var toast = this.$mdToast.simple()
            .textContent(this.data.id ? "Changes saved" : "New member created" )
            .position('bottom center')
            .parent();
          this.$mdToast.show(toast);
        },
        (err) => {
          // notify the user operation failed
          var toast = this.$mdToast.simple()
            .textContent('Error saving data')
            .position('bottom center')
            .parent();
          this.$mdToast.show(toast);

          console.log('Error saving member data.');
          console.log(err);
        }
    );
  }
 
}