import memberInvolvementOptions from '../../assets/json/formOptions/member.involvement.json';

export default class DashboardMemberDialogController {
  
  constructor(DashboardMemberService, $cookies, $mdDialog, $rootScope, $state, $stateParams, $mdToast, locals) {
    'ngInject';
    
    this.DashboardMemberService = DashboardMemberService;

    this.$mdToast = $mdToast;
    this.$rootScope = $rootScope;
    this.$mdDialog = $mdDialog;
    
    this.memberInvolvementOptions = memberInvolvementOptions;

    this.context = "dashboard.member.edit";

    this.item = locals.item;

    if ( ! this.item ) this.item = { person: {} };
    if ( ! this.item.person  ) this.item.person =  {};
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

    console.log(this.item);

    return this.DashboardMemberService.save(this.item).then(
        (response) => {   
          console.log('Save successful');
          console.log(response);
          var savedItem = response.data;
          this.$mdDialog.hide(savedItem);
        },
        (error) => {
          console.log('Error saving member data.');
          console.log(error);
          if ( error.status == 500) {
            message = 'Internal server error.';
          }
          else {
             message = error.data.message;
          }
         

          // notify the user operation failed
          var toast = this.$mdToast.simple()
            .textContent(message)
            .position('bottom center')
            .parent();
          this.$mdToast.show(toast);


        }
    );
  }
 
}