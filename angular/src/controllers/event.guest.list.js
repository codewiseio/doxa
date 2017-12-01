
import eventGuestStatusOptions from '../assets/json/formOptions/event.guest.status.json';

export default class EventGuestInviteController {
  constructor(GuestService, AppDataService, $stateParams, $mdDialog, $mdToast, $http, locals) {
    'ngInject';
    
    this.service = this.GuestService = GuestService;

    this.AppDataService = AppDataService
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.$stateParams = $stateParams;
    this.$http = $http;
    
    this.context = "event.guestlist";
    this.errors = [];

    this.event = locals.event;
    this.items = [];
    this.selectedItems = [];


    this.enum = {
      'status':AppDataService.enumerate(eventGuestStatusOptions)
    }
    
    this.initPage();    
  }
  

  initPage() {
    this.organization = this.AppDataService.organization;
    this.refresh();
  }


  /**
   * Close the dialog without making changes.
   */
  cancel() {
    this.$mdDialog.cancel();
  }

  /**
   * Reload data from database and refresh the page
   * @return Promise
   */
  refresh() {

    this.GuestService.list(this.event.id).then(
        (response) => {
            this.items = response.data;
        },
        (error) => {
            console.log('Could not load members list.');
        }
    );
  }

  remove(item) {

    this.GuestService.remove(item.id).then(
        (response) => {
            console.log('Removed item.');
            console.log(response);
            // remove item from the list of items
            var idx = this.items.indexOf(item);
            console.log('Item id: ' + idx);
            if (idx > -1) {
              this.items.splice(idx, 1);
            }
        },
        (error) => {
            console.log('Could not remove member.');
        }
    );
  }

  /**
   * Selects or unselects the current item. Triggerd when clicking checkbox.
   * @param  {item} The list item to toggle
   */
  toggleItem(item) {
    var idx = this.selectedItems.indexOf(item);
    if (idx > -1) {
      this.selectedItems.splice(idx, 1);
    }
    else {
      this.selectedItems.push(item);
    }
  }
  
}