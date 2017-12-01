
import ListViewController from '../lib/list.view.controller.js';
import memberInvolvementOptions from '../assets/json/formOptions/member.involvement.json';


export default class MembersController extends ListViewController {
  constructor(AppDataService, MemberService, SweetAlert, $cookies, $state, $scope, $stateParams, $mdDialog, $mdToast) {
    'ngInject';

    super();

    this.MemberService = MemberService;
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

    this.enum = {
      'involvement' : AppDataService.enumerate(memberInvolvementOptions)
    }


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
      this.MemberService.list( this.organization.id, params ).then(
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
        role: 1
      };

      this.edit(item, $event);
    }


    /**
     * Opens a dialog to edit item
     * @param  {object} $item   The item to be edited
     * @param  {event} $event   The event triggering the dialog to open
     */
    edit(item, $event=null) {
      return this.editItem(item, 
        {
          controller: 'MemberEditDialogController as $ctrl',
          templateUrl: 'dashboard.member.dialog.edit.html',
          targetEvent: $event
        },
      );
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
            this.MemberService.delete(item.id).then(
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
            this.MemberService.deleteMultiple(ids).then(
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