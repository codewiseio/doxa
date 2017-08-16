
import ListViewController from '../../common/list.view.controller.js';
export default class DashboardGroupsController extends ListViewController {
  constructor(GroupService, AppDataService, $cookies, $state, $stateParams, $mdDialog, $mdToast) {
    'ngInject';

    super();
    
    this.GroupService = GroupService;
    this.AppDataService = AppDataService;
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
   * Opens a dialog to create a new group
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  new(item=null, $event=null) {

    if ( ! item ) item = { organization_id: this.AppDataService.organization.id };

    return this.$mdDialog.show({
          controller: 'DashboardGroupEditDialogController as $ctrl',
          templateUrl: 'dashboard.group.edit.dialog.html',
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
              console.log('Groups controller received edited item:')
              console.log(item);

              // add it to the beginning of list
              this.items.unshift(item);

              // notify the user
              var toast = this.$mdToast.simple()
                .textContent("Group Data Saved Successfuly" )
                .position('bottom center')
                .parent();
              this.$mdToast.show(toast);
            }
        }, (error) => {
            console.log('error');
        });
  }


  delete(item, event) {
      var confirm = this.$mdDialog.confirm()
        //.title(`Really delete ${item.entity.first_name} ${item.entity.last_name}?`)
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
    this.GroupService.delete(item.id).then(
      () => {
          this.$mdDialog.hide();

          var toast = this.$mdToast.simple()
              //.textContent(`Deleted ${item.entity.first_name} ${item.entity.last_name}`)
              .textContent(`Deleted Successfully`)
              .position('bottom center')
              .parent();
          this.$mdToast.show(toast);

          $(`#group-${item.id}`).remove();
          console.log($(`#group:${item.id}`));
        }
    );
  }

  cancel() {
    console.log('Canceled');
    this.$mdDialog.cancel();
  }

  /**
   * Opens a dialog to edit group.
   * @param  {object} $item   The item to be edited
   * @param  {event} $event   The event triggering the dialog to open
   */
  edit(item, $event=null) {
    $event.stopPropagation();
    // $event.preventDefault();
    


    return this.$mdDialog.show({
          controller: 'DashboardGroupEditDialogController as $ctrl',
          templateUrl: 'dashboard.group.edit.dialog.html',
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
              console.log('Group Controller Received edited item:')
              console.log('item',item);
              return false;
              // add it to the beginning of list
              // this.items.unshift(item);

              // notify the user
              var toast = this.$mdToast.simple()
                .textContent(" Group Updated" )
                .position('bottom center')
                .parent();
              this.$mdToast.show(toast);

            }
        }, (error) => {
            console.log('error');
        });
  }

  

    /**
    *Remove all or selected groups collectively
    */
    removeGroups(items,event){
      var confirm = this.$mdDialog.confirm()
        //.title(`Really delete ${item.entity.first_name} ${item.entity.last_name}?`)
        .title(`Really delete all selected groups ?`)
        .textContent('This is permanent.')
        .ariaLabel('Really delete?')
        .targetEvent(event)
        .ok('Yes')
        .cancel('No');

      this.$mdDialog.show(confirm).then(
        () => {
          this.GroupService.removeGroups(items,this.organization.id).then(
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

    refreshResults() {

      console.log('Refreshing');

      var params = {};
      params.sortOrder = this.sortOrder;
      params.filter = this.filter;
      console.log(params);


      // Retrieve group members
      this.GroupService.list(this.organization.id, params).then(
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