
export default class EventGuestInviteController {
  constructor(GuestService, AppDataService, $stateParams, $mdDialog, $mdToast, $http, locals) {
    'ngInject';
    
    this.service = this.GuestService = GuestService;

    this.AppDataService = AppDataService
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.$stateParams = $stateParams;
    this.$http = $http;
    
    this.context = "event.invite";
    this.errors = [];

    this.event = locals.event;
    this.selectedItems = [];
    
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

    this.GuestService.eligible(this.event.id).then(
        (response) => {
            this.items = response.data;
        },
        (error) => {
            console.log('Could not load members list.');
        }
    );
  }

  /**
   * Save invitations
   * @return Promise
   */
  save() {

    console.log(this.selectedItems);

    let people = [];
    this.selectedItems.forEach( function(item) {
      people.push(item.person.id);
    });

    return this.GuestService.invite(this.event.id, people).then(
      (response) => {
          this.$mdDialog.hide(response);
          console.log(response);
      },
      (error) => {

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