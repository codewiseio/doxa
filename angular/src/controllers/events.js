
import ListViewController from '../lib/list.view.controller.js';

export default class EventsController extends ListViewController {
  constructor(EventService, AppDataService, SweetAlert, $cookies, $state, $stateParams, $mdDialog, $mdToast) {
    'ngInject';
    super();
    
    this.EventService = EventService;
    this.AppDataService = AppDataService;
    this.SweetAlert = SweetAlert;
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;

    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    
    this.context = "dashboard.events";
    this.errors = [];

    this.AppDataService = AppDataService
    this.AppDataService.pageTitle = `Events`;

    this.selectedItems = [];
    this.allItemsSelected = false;
    this.items = [];

    this.filter = {};
    this.filter.organization = this.AppDataService.organization.id;
    this.propertyName = ''

    this.initPage();    
  }
  

  /**
   * Retrieves the currently active organization as an object.
   */
  initPage() {

    this.AppDataService.pageType = 'dashboard';
    this.AppDataService.pageTitle = `Events`;
    this.AppDataService.previousState = 'dashboard.home()';

    // get currently set organization
    this.organization = JSON.parse(this.$cookies.get('organization'));
    this.refreshResults();
 
  }

  
  /**
   * Opens a dialog to create a new event
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  new(item=null, $event=null) {

    if ( ! item ) item = { organization_id: this.AppDataService.organization.id, 'visibility':1 };

    this.edit(item, $event);
  }


  /**
   * Delete an event
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
            this.EventService.delete(item.id).then(
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


  /**
   * Opens a dialog to edit event.
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  edit(item, $event=null) {

    let newItem = item.id ? false : true;

    return this.$mdDialog.show({
          controller: 'EventEditDialogController as $ctrl',
          templateUrl: 'event.edit.dialog.html',
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
               if ( newItem) this.items.unshift(item);

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

    duplicate(item, $event=null) {
      console.log('Duplicating item.');
      console.log(item);

      var itemCopy = {};
      angular.copy(item, itemCopy);
      itemCopy.id = null;
      itemCopy.organization_id = itemCopy.organization;
      delete itemCopy.organization;


      this.new(itemCopy);
    }

    /**
     * Refresh the currently displayed results. Called after filter changes and page load.
     */
    refreshResults() {

      var params = this.getFilterParams();
      console.log(params);

      // Retrieve record data
      this.EventService.list(params).then(
          (response) => {
            console.log('Retrieved events:',response)
            this.items = response.data;
          },
          (err) => {
            var toast = this.$mdToast.simple()
              .textContent(error.data.message)
              .position('top right')
              .parent();

            this.$mdToast.show(toast);
          }
      );  
    }

  

    /**
    *Remove all or selected groups collectively
    */
    removeEvents(items,event){
      var confirm = this.$mdDialog.confirm()
        //.title(`Really delete ${item.entity.first_name} ${item.entity.last_name}?`)
        .title(`Really delete all selected events ?`)
        .textContent('This is permanent.')
        .ariaLabel('Really delete?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      this.$mdDialog.show(confirm).then(
        () => {
          this.EventService.removeEvents(items,this.organization.id).then(
            (response) => {
              console.log('response',response)
                this.items = response.data;
                var toast = this.$mdToast.simple()
                  .textContent('Deleted Successfully')
                  .position('bottom left')
                  .parent();
                  this.$mdToast.show(toast);
            },
            (err) => {
              var toast = this.$mdToast.simple()
              .textContent('error')
              .position('bottom left')
              .parent();
              this.$mdToast.show(toast);
            }
          ); 
        }
      );
    }
}