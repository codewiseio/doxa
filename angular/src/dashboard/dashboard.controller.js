class DashboardController {
  constructor(AuthenticationService, AppDataService, $cookies, $mdDialog, $location, $rootScope, $state) {
    'ngInject';

    this.AppDataService = AppDataService
    this.AppDataService.pageType = 'dashboard';
    this.AppDataService.pageTitle = `Dashboard`;

    this.AuthenticationService = AuthenticationService;

    this.$mdDialog = $mdDialog;
    this.$location = $location;

    // If the user is not authenticated they should not be here
    if (! AuthenticationService.isAuthenticated()) {
        $state.go('login');
    }

    // Get the active organization using cookie
    this.AppDataService.user = $rootScope.user = JSON.parse($cookies.get('authenticatedAccount'));
    this.AppDataService.organization = $rootScope.organization = JSON.parse($cookies.get('organization'));
  }


  initPage() {

    
  }



  /**
   * Opens a dialog to edit group.
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  editOrganizationDetails(item, $event) {

    item = item || this.AppDataService.organization;

    return this.$mdDialog.show({
          controller: 'OrganizationEditDialogController as $ctrl',
          templateUrl: 'organization.edit.dialog.html',
          locals: { "item": item },
          clickOutsideToClose:true,
          fullscreen: true,
          parent: angular.element(document.body),
          targetEvent: $event
        })
        .then(
          (item) => {
            // if and item was returned the action completed successfuly
            if ( item ) {

              // notify the user
              var toast = this.$mdToast.simple()
                .textContent("Saved" )
                .position('bottom center')
                .parent();
              this.$mdToast.show(toast);

            }
        }, (error) => {
            console.log('error');
            // TODO: Display user error
        });
    }


    /**
     * Logout the user
     * @return Promise
     */
    logout() {
        this.AuthenticationService.logout().then(
            () => {
                this.$location.url('/');

              // notify the user
              var toast = this.$mdToast.simple()
                .textContent("Logged out" )
                .position('bottom center')
                .parent();
              this.$mdToast.show(toast);

            },
            (err) => {

              // notify the user
              var toast = this.$mdToast.simple()
                .textContent("Error logging out" )
                .position('bottom center')
                .parent();

              this.$mdToast.show(toast);

              console.log(err);

            }
            
        );
    }

}


export default DashboardController;