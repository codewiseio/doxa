


export default class EventController {constructor(EventService, AppDataService, $stateParams, $mdDialog, $mdToast, $http) {
    'ngInject';
    
    this.EventService = EventService;
    this.AppDataService = AppDataService
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.$stateParams = $stateParams;
    this.$http = $http;
    
    this.context = "dashboard.event.view";
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
    this.EventService.get(id, { context: this.context }).then(
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
   * Opens a dialog to create a new event
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  edit(item, $event=null) {

    console.log('Edit item.');

    return this.$mdDialog.show({
          controller: 'EventEditDialogController as $ctrl',
          templateUrl: 'event.invite.dialog.html',
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
              console.log('Events controller received edited item:')
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

  /**
   * Invite members to the event
   * @param  {event} $event 
   */
  invite($event) {
    return this.$mdDialog.show({
              controller: 'EventGuestInviteController as $ctrl',
              templateUrl: 'event.guest.invite.dialog.html',
              locals: { "event": this.item },
              clickOutsideToClose:true,
              fullscreen: true,
              parent: angular.element(document.body),
              targetEvent: $event
            })
            .then(
              (response) => {
                // notify the user
                var toast = this.$mdToast.simple()
                  .textContent(response.data.message)
                  .position('bottom left')
                  .parent();
                this.$mdToast.show(toast);

            }, (error) => {
                console.log('error');
            });
  }

  guestList($event) {
    return this.$mdDialog.show({
              controller: 'EventGuestListController as $ctrl',
              templateUrl: 'event.guest.list.dialog.html',
              locals: { "event": this.item },
              clickOutsideToClose:true,
              fullscreen: true,
              parent: angular.element(document.body),
              targetEvent: $event
            })
            .then(
              (response) => {
                // notify the user
                var toast = this.$mdToast.simple()
                  .textContent(response.data.message)
                  .position('bottom left')
                  .parent();
                this.$mdToast.show(toast);

            }, (error) => {
                console.log('error');
            });
  }
  

  
}