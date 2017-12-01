
import ListViewController from '../lib/list.view.controller.js';
export default class DashboardGroupsController extends ListViewController {
  constructor(GroupService, AppDataService, SweetAlert, $cookies, $state, $stateParams, $mdDialog, $mdToast) {
    'ngInject';

    super();
    
    this.GroupService = GroupService;
    this.AppDataService = AppDataService;
    this.SweetAlert = SweetAlert;
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;

    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    
    this.context = "dashboard.groups";
    this.errors = [];

    this.AppDataService = AppDataService
    this.AppDataService.pageTitle = `Groups`;

    this.selectedItems = [];
    this.allItemsSelected = false;
    this.items = [];

    this.filter = {};
    this.filter.organization = this.AppDataService.organization.id;

    this.initPage();    
  }
  

  /**
   * Retrieves the currently active organization as an object.
   */
  initPage() {

    this.AppDataService.pageType = 'dashboard';
    this.AppDataService.pageTitle = `Groups`;
    this.AppDataService.previousState = 'dashboard.home()';

    // get currently set organization
    this.organization = JSON.parse(this.$cookies.get('organization'));
    let id = this.$stateParams.id;
    this.refreshResults();

  }


    /**
     * Opens a dialog to create a new group
     * @param  {object} $item   The item to be edited
     * @param  {event} $event   The event triggering the dialog to open
     */
    new(item=null, $event=null) {

      if ( ! item ) item = { organization_id: this.AppDataService.organization.id };

      this.edit( item, $event );
    }

    /**
     * Opens a dialog to edit event.
     * @param  {object} $item   The item to be edited
     * @param  {event} $event   The event triggering the dialog to open
     */
    edit(item, $event=null) {
      return this.editItem(item, 
        {
          controller: 'GroupEditDialogController as $ctrl',
          templateUrl: 'dashboard.group.edit.dialog.html',
          targetEvent: $event
        },
      );
    }


  /**
   * Delete a group
   * @param  {[type]} item  [description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  delete(item, event) {

    this.SweetAlert.swal({
            title: `Really delete ${item.name}?`,
            text: 'You will not be able to undo this action!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'No, keep',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then(
          () => {
            // perform the delete operation
            this.GroupService.delete(item.id).then(
                (response) => {
                    // remove the item from the list
                    var idx = this.items.indexOf(item);
                    this.items.splice(idx, 1);

                    // display a message to the user
                    this.SweetAlert.swal({
                      title: 'Deleted!',
                      text: `${item.name} has been deleted.`,
                      type: 'success',
                      confirmButtonClass: "btn btn-success",
                      buttonsStyling: false
                    })
                },
                (error) => {
                    var message = error.data.message;
                    this.SweetAlert.swal({
                      title: `Could not delete ${item.name}`,
                      text: message,
                      type: 'error',
                      confirmButtonClass: "btn btn-info",
                      buttonsStyling: false
                    })
                }
            );
          },
          (dismiss) => {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {

            }
          }
        );
  }


  cancel() {
    console.log('Canceled');
    this.$mdDialog.cancel();
  }

  
  /**
   * Delete a member from from the organization with confirm.
   * @param  {Object} item   Member to delete
   * @param  {Object} event  The trigger event
   */
  deleteMultiple(items, event) {

    let nItems = items.length;
    let ids = items.map( function(item){ return item.id } );

    // only deleting 1 member?
    if ( nItems == 1 ) {
      return this.delete(items[0], event);
    }


    this.SweetAlert.swal({
            title: `Really delete these ${nItems} groups?`,
            text: 'You will not be able to undo this action!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'No, keep',
            confirmButtonClass: "btn btn-success",
            cancelButtonClass: "btn btn-danger",
            buttonsStyling: false
        }).then(
          () => {
            // perform the delete operation
            this.GroupService.deleteMultiple(ids).then(
                (response) => {
                    // remove the item from the list
                    items.forEach( (item) => {
                        var idx = this.items.indexOf(item);
                        this.items.splice(idx, 1);
                    });

                    // display a message to the user
                    this.SweetAlert.swal({
                      title: 'Deleted!',
                      text: `${nItems} groups have been deleted.`,
                      type: 'success',
                      confirmButtonClass: "btn btn-success",
                      buttonsStyling: false
                    })
                },
                (error) => {
                    var message = error.data.message;
                    this.SweetAlert.swal({
                      title: `Could not delete these groups.`,
                      text: message,
                      type: 'error',
                      confirmButtonClass: "btn btn-info",
                      buttonsStyling: false
                    })
                }
            );
          },
          (dismiss) => {
            // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {

            }
          }
        );

  }
  

  refreshResults() {

    console.log('Refreshing');

    var params = this.getFilterParams();
    console.log(params);


    // Retrieve group members
    this.GroupService.list(params).then(
        (response) => {
          this.items = response.data;
        },
        (error) => {
          console.log('Could not retrieve group members.');
          var toast = this.$mdToast.simple()
            .textContent(error.data.message)
            .position('top right')
            .parent();
          this.$mdToast.show(toast);
        }
    );
  }
}