
import ListViewController from '../../common/list.view.controller.js';

export default class DashboardMembersController extends ListViewController {
  constructor(AppDataService, DashboardMemberService, SweetAlert, $cookies, $state, $scope, $stateParams, $mdDialog, $mdToast) {
    'ngInject';

    super();

    this.DashboardMemberService = DashboardMemberService;
    this.SweetAlert = SweetAlert;
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.$scope = $scope;

    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    
    this.context = "dashboard.members";
    this.errors = [];

    this.AppDataService = AppDataService
    this.AppDataService.pageTitle = `Members`;

    this.items = [];
    this.selectedItems = [];
    this.allItemsSelected = false;

    console.log(this.$scope);

    var $this = this;
    this.$scope.$watch('$ctrl.selectedItems', function (newValue, oldValue, scope) {
        $this.checkAllItemsSelected();
    }, true);
    this.$scope.$watch('$ctrl.items', function (newValue, oldValue, scope) {
        $this.checkAllItemsSelected();
    }, true);
    
    this.initPage();    
  }
  

  /**
   * Retrieves the currently active organization as an object.
   */
  initPage() {
    // get currently set organization
    let id = this.$stateParams.id;
    this.organization = this.AppDataService.organization;
    this.refreshResults();
  }

  /**
   * Refresh the displayed results
   * @return {[type]} [description]
   */
  refreshResults() {
    console.log('refreshing');

    var params = this.getFilterParams();

    // Retrieve record data
    this.DashboardMemberService.list( this.organization.id, params ).then(
        (response) => {
          console.log('retrieved members: ',response.data)
          this.items = response.data;
        },
        (err) => {
          var toast = this.$mdToast.simple()
            .textContent(error.data.message)
            .position('bottom center')
            .parent();

          this.$mdToast.show(toast);
        }
    );   
  }
      

  /**
   * Opens a dialog to edit member.
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  new(item=null, $event=null) {

    if ( ! item ) item = { 
      person: {}, 
      organization_id: this.AppDataService.organization.id, 
      role: 'Member' 
    };

    this.edit(item, $event);
  }

  /**
   * Opens a dialog to edit member.
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  edit(item, $event=null) {

    // fetch html
    console.log('Editing');
    console.log(item);

    let newItem = item.id ? false : true;
    
    
    // display dialog
    this.$mdDialog.show({
          controller: 'DashboardMemberDialogController as $ctrl',
          templateUrl: 'dashboard.member.dialog.edit.html',
          locals: { "item": item },
          clickOutsideToClose:true,
          fullscreen: true,
          parent: angular.element(document.body),
          targetEvent: $event,

        })
        .then(
          (item) => {

            // if and item was returned the action completed successfuly
            if ( item ) {
              // add it to the beginning of list
              if ( newItem) this.items.unshift(item);
            }
        }, (error) => {
            console.log('error');
        });

  }

  /**
   * Delete a member from from the organization with confirm.
   * @param  {Object} item   Member to delete
   * @param  {Object} event  The trigger event
   */
  delete(item, event) {

    this.SweetAlert.swal({
            title: `Really delete ${item.person.first_name} ${item.person.last_name}?`,
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
            this.DashboardMemberService.delete(item.person.id).then(
                (response) => {
                    // remove the item from the list
                    var idx = this.items.indexOf(item);
                    this.items.splice(idx, 1);

                    // display a message to the user
                    this.SweetAlert.swal({
                      title: 'Deleted!',
                      text: `${item.person.first_name} ${item.person.last_name} has been deleted.`,
                      type: 'success',
                      confirmButtonClass: "btn btn-success",
                      buttonsStyling: false
                    })
                },
                (error) => {
                    var message = error.data.message;
                    this.SweetAlert.swal({
                      title: `Could not delete ${item.person.first_name} ${item.person.last_name}`,
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
            title: `Really delete these ${nItems} members?`,
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
            this.DashboardMemberService.deleteMultiple(ids).then(
                (response) => {
                    // remove the item from the list
                    items.forEach( function(item) {
                        var idx = this.items.indexOf(item);
                        this.items.splice(idx, 1);
                    });
                    

                    // display a message to the user
                    this.SweetAlert.swal({
                      title: 'Deleted!',
                      text: `${nItems} members have been deleted.`,
                      type: 'success',
                      confirmButtonClass: "btn btn-success",
                      buttonsStyling: false
                    })
                },
                (error) => {
                    var message = error.data.message;
                    this.SweetAlert.swal({
                      title: `Could not delete these members.`,
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



}