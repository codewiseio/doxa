
import ListViewController from '../../common/list.view.controller.js';
export default class EventsController extends ListViewController {
  constructor(EventService, AppDataService, $cookies, $state, $stateParams, $mdDialog, $mdToast) {
    'ngInject';
    super();
    
    this.EventService = EventService;
    this.AppDataService = AppDataService;
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

    if ( ! item ) item = { organization_id: this.AppDataService.organization.id };

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
              console.log('Events controller received edited item:')
              console.log(item);

              // add it to the beginning of list
              this.items.unshift(item);

              // notify the user
              // var toast = this.$mdToast.simple()
              //   .textContent("New event created" )
              //   .position('bottom center')
              //   .parent();
              // this.$mdToast.show(toast);
            }
        }, (error) => {
            console.log('error');
        });
  }

   /**
   * Delete an Events
   * 
   */
   delete(item, event) {
      var confirm = this.$mdDialog.confirm()
        .title(`Really delete ${item.name}?`)
        .textContent('This is permanent.')
        .ariaLabel('Really delete?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      this.$mdDialog.show(confirm).then(
        () => {
          this._deleteItem(item);

        }
      );
  }

  _deleteItem(item) {
    this.EventService.delete(item.id).then(
      (response) => {
          this.$mdDialog.hide();

          var toast = this.$mdToast.simple()
              //.textContent(`Deleted ${item.person.first_name} ${item.person.last_name}`)
              .textContent(`Deleted Successfully`)
              .position('bottom center')
              .parent();
          this.$mdToast.show(toast);
          $(`#event-${item.id}`).remove();
          console.log($(`#event:${item.id}`));
        },
      (error) => {
            //console.log('Could not add member to group.')
            var message = error.data.message;
            var toast = this.$mdToast.simple()
              .textContent(message)
              .position('bottom center')
              .parent();
            this.$mdToast.show(toast);
          }
    );
  }


  /**
   * Opens a dialog to edit event.
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  edit(item, $event=null) {

    $event.stopPropagation();
    // $event.preventDefault();

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
              console.log('Events Controller Received edited item:')
              console.log('item',item);
              return false;
              // add it to the beginning of list
              // this.items.unshift(item);

              // notify the user
              var toast = this.$mdToast.simple()
                .textContent(" Event Updated" )
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
      this.EventService.list(this.organization.id, params).then(
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