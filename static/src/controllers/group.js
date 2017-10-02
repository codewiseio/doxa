


export default class GroupController {
  constructor(GroupService, AppDataService, $stateParams, $mdDialog, $mdToast, $http) {
    'ngInject';
    
    this.GroupService = GroupService;
    this.AppDataService = AppDataService
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.$stateParams = $stateParams;
    this.$http = $http;
    
    this.context = "dashboard.group.view";
    this.errors = [];
    
    this.initPage();    
  }
  
  initPage() {
    this.organization = this.AppDataService.organization;

    let id = this.$stateParams.id;

    this.AppDataService.pageType = 'component';
    this.AppDataService.previousState = 'dashboard.home()';
    this.AppDataService.contextMenu = null;

    // Retrieve record data
    this.GroupService.get(id, { context: this.context }).then(
        (response) => {
          console.log('Retrieved record');
          console.log(response.data);
          this.item = response.data;
          this.AppDataService.pageTitle = `${this.item.name}`;
        },
        (err) => {
          // TODO: Go to 404
          console.log('Error fetching data.');
          console.log(error);
          var toast = this.$mdToast.simple()
            .textContent(error.data.message)
            .position('top right')
            .parent();
          this.$mdToast.show(toast);
        }
    );

  }


  /**
   * Opens a dialog to create a new group
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  edit(item, $event=null) {

    console.log('Edit item.');

    return this.$mdDialog.show({
          controller: 'GroupEditDialogController as $ctrl',
          templateUrl: 'dashboard.group.edit.dialog.html',
          locals: { "item": this.item },
          clickOutsideToClose:true,
          fullscreen: true,
          parent: angular.element(document.body),
          targetEvent: $event
        })
        .then(
          (item) => {

            // if and item was returned the action completed successfuly
            if ( item ) {
              console.log('Groups controller received edited item:')
              console.log(item);

              this.item = item;

              // notify the user
              var toast = this.$mdToast.simple()
                .textContent("Saved" )
                .position('bottom center')
                .parent();
              this.$mdToast.show(toast);
            }
        }, (error) => {
            console.log('error');
        });
  }
  

  
}