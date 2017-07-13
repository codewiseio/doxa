
export default class UserController {
  constructor(UserService, $mdToast, $mdDialog, $cookies, $rootScope, $state) {
    'ngInject';
    
    this.UserService = UserService;
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.$rootScope = $rootScope;
    
    this.context = "dashboard.account.edit";
    this.errors = [];
    
    this.data = $rootScope.user;
 
  }
  
  /**
   * Close the dialog without making changes.
   */
  cancel() {
    this.$mdDialog.cancel();
  }

  
   /**
    * @name save
    * @description Save data for user
    * @returns {Promise}
    */
  save() {

    // don't save password if not updated
    if ( ! this.data.password ) {
        delete this.data.password;
    }

    this.UserService.save(this.data).then(
        (response) => {          
          this.item = response.data;
          this.$mdDialog.hide();

          // notify the user operation failed
          var toast = this.$mdToast.simple()
            .textContent("Changes saved" )
            .position('bottom center')
            .parent();
          this.$mdToast.show(toast);

        },
        (err) => {
          // notify the user operation failed
          var toast = this.$mdToast.simple()
            .textContent("Error saving user data." )
            .position('bottom center')
            .parent();
          this.$mdToast.show(toast);
        }
    );
  }


  
}