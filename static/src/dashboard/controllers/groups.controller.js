

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

    this.AppDataService.pageType = 'dashboard';
    this.AppDataService.pageTitle = `Groups`;
    this.AppDataService.previousState = 'dashboard.home()';

    // get currently set organization
    this.organization = JSON.parse(this.$cookies.get('organization'));


    let id = this.$stateParams.id;

    // Retrieve record data
    this.GroupService.list(this.organization.id).then(
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
                .textContent("New group created" )
                .position('bottom center')
                .parent();
              this.$mdToast.show(toast);
            }
        }, (error) => {
            console.log('error');
        });
  }


  /**
   * Sorting of Groups
   * 
   */
   sortBy(filter){
    this.filter = filter
    console.log(this.organization.id,this.filter)
    this.GroupService.sort(this.organization.id,this.filter).then(
     (response) => {
          console.log('res>>',response)
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

  isItemSelected(item) {
    if (this.selectedItems === undefined){
    }
    else{
      return this.selectedItems.indexOf(item) > -1;
    }
  }

    toggleItem(item) {
      if(this.selectedItems){
        var idx = this.selectedItems.indexOf(item);

        if (idx > -1) {
          this.selectedItems.splice(idx, 1);
        }
        else {
          this.selectedItems.push(item);
        }
        this.checkAllItemsSelected();
      }
    }

    checkAllItemsSelected() {
      if(this.selectedItems){
        if ( this.items.length && this.selectedItems.length == this.items.length ) {
          this.allItemsSelected = true;
        }
        else {
          this.allItemsSelected = false;
        }
      }
    }

    toggleAll() {
      var selectedItems = [];

      // select all items
      if ( ! this.allItemsSelected ) {
        this.items.forEach( function(event) {
          selectedItems.push(event);
        });
      }

      this.selectedItems = selectedItems;
      this.checkAllItemsSelected();

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
                  .textContent('deleted successfully')
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