

export default class DashboardGroupsController {
  constructor(GroupService, AppDataService, $cookies, $state, $stateParams, $mdDialog, $mdToast) {
    'ngInject';
    
    this.GroupService = GroupService;
    this.AppDataService = AppDataService;
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;

    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    
    this.context = "dashboard.groups";
    this.errors = [];

   

    this.initPage();    
  }
  

  /**
   * Retrieves the currently active organization as an object.
   */
  initPage() {

    this.AppDataService.pageType = 'component';
    this.AppDataService.pageTitle = `Groups`;
    this.AppDataService.previousState = 'dashboard.home()';

    // get currently set organization
    this.organization = JSON.parse(this.$cookies.get('organization'));


    let id = this.$stateParams.id;

    // Retrieve record data
    this.GroupService.list( { organization: this.organization.id } ).then(
        (response) => {
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
   * Opens a dialog to edit member.
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  create(item, $event) {
    item = {
      contacts: [ { kind: 'email' }, { kind: 'telephone' }, { kind: 'address' }  ]
    }
    return this.edit(item,$event);
  }

  /**
   * Opens a dialog to edit member.
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  edit(item, $event) {
    this.$mdDialog.show({
      templateUrl: 'dashboard.member.dialog.edit.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      controller: 'DashboardMemberDialogController as $ctrl',
      clickOutsideToClose:true,
      fullscreen: true,
      locals: {
        "item": item
      }
    })
    .then(
      (answer) => {
        console.log(item);
    }, () => {
        console.log(item);
        console.log('canceled');
    });
  }

  view(item, $event) {
    this.$mdDialog.show({
      templateUrl: 'dashboard.member.dialog.view.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      controller: 'DashboardMemberDialogController as $ctrl',
      clickOutsideToClose:true,
      fullscreen: true,
      locals: {
        "item": item
      }
    })
    .then(function(answer) {
        console.log(answer);
    }, function() {
        console.log('canceled');
    });
  }

  delete(item, event) {
      var confirm = this.$mdDialog.confirm()
        .title(`Really delete ${item.entity.first_name} ${item.entity.last_name}?`)
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
    this.DashboardMemberService.delete(item.id).then(
      () => {
          this.$mdDialog.hide();

          var toast = this.$mdToast.simple()
              .textContent(`Deleted ${item.entity.first_name} ${item.entity.last_name}`)
              .position('top right')
              .parent();
          this.$mdToast.show(toast);

          $(`#member-${item.id}`).remove();
          console.log($(`#member:${item.id}`));
        }
    );
  }

  cancel() {
    console.log('Canceled');
    this.$mdDialog.cancel();
  }
  
}