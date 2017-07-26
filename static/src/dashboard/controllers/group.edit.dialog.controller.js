export default class DashboardGroupEditDialogController {
  
  constructor(GroupService, $mdDialog,  $mdToast, $state, locals) {
    'ngInject';
    
    this.GroupService = GroupService;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.$state = $state;
    
    this.context = "dashboard.group.edit";
    this.item = locals.item;

    if ( ! this.item ) this.item = {  };
  }
  
  /**
   * Close the dialog without making changes.
   */
  cancel() {
    this.$mdDialog.cancel();
  }



  /**
   * Save changes to the item
   */
  save() {

    console.log('Saving group');
    console.log('item',this.item);

    return this.GroupService.save(this.item).then(
        (response) => {   
          console.log('Save successful');
          console.log(response);
          var savedItem = response.data;
          this.$mdDialog.hide(savedItem);
        },
        (error) => {

          message = error.data.message;

          // notify the user operation failed
          var toast = this.$mdToast.simple()
            .textContent(message)
            .position('bottom center')
            .parent();
          this.$mdToast.show(toast);

          console.log('Error saving member data.');
          console.log(error);
        }
    );
  }

  /**
   * Delete this item
   */
  remove(item=null, $event) {
      console.log('Confirm remove.');
      console.log(item);

      if ( ! item ) item = this.item;


     // Appending dialog to document.body to cover sidenav in docs app
      var confirm = this.$mdDialog.confirm({ multiple: true, locals: {item: item } })
            .title('Really remove this group?')
            .textContent('You will not be able to undo this. Are you sure?')
            .ariaLabel('Really delete?')
            .targetEvent($event)
            .ok('Yes, remove this group')
            .cancel('No, keep this group')
            .multiple(true);

      this.$mdDialog.show(confirm).then(
          // user confirmed delete
          () => {

            console.log('Confirm ');
            console.log(this.item);

            this.GroupService.delete(item.id).then(
                    (response) => {   
                      console.log('Remove successful');
                      console.log(response.data);

                      // notify the user
                      var toast = this.$mdToast.simple()
                        .textContent(`Deleted group ${item.name}`)
                        .position('bottom center')
                        .parent();

                      this.$mdToast.show(toast);
                      this.$state.go('dashboard.groups');

                    },
                    (error) => {

                      message = error.data.message;

                      // notify the user operation failed
                      var toast = this.$mdToast.simple()
                        .textContent(message)
                        .position('bottom center')
                        .parent();

                      this.$mdToast.show(toast);

                      console.log('Error removing group.');
                      console.log(error);
                    }
                );

          },
          // user canceled delete
          () => {
            console.log('Cancelled delete item.');
          }
      );



    return this.GroupService.save(this.item).then(
        (response) => {   
          console.log('Save successful');
          console.log(response);
          var savedItem = response.data;
          this.$mdDialog.hide(savedItem);
        },
        (error) => {

          message = error.data.message;

          // notify the user operation failed
          var toast = this.$mdToast.simple()
            .textContent(message)
            .position('bottom center')
            .parent();
          this.$mdToast.show(toast);

          console.log('Error saving member data.');
          console.log(error);
        }
    );
  }
 
}