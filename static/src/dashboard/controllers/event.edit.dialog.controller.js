export default class EventEditDialogController {
  
  constructor(EventService, $mdDialog,  $mdToast, $state, locals) {
    'ngInject';
    
    this.EventService = EventService;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.$state = $state;
    
    this.context = "dashboard.event.edit";
    this.item = locals.item;

    this.displayEndTime = false;

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

    console.log('Saving');
    console.log(this.item);

    return this.EventService.save(this.item).then(
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

          console.log('Error saving event data.');
          console.log(error);
        }
    );
  }

  /**
   * Delete this item
   */
  remove(item=null, $event) {

      console.log('Confirm remove event.');
      console.log(item);

      if ( ! item ) item = this.item;


     // Appending dialog to document.body to cover sidenav in docs app
      var confirm = this.$mdDialog.confirm({ multiple: true, locals: {item: item } })
            .title('Really remove this event?')
            .textContent('You will not be able to undo this. Are you sure?')
            .ariaLabel('Really delete?')
            .targetEvent($event)
            .ok('Yes, remove this event')
            .cancel('No, keep this event')
            .multiple(true);

      this.$mdDialog.show(confirm).then(
          // user confirmed delete
          () => {

            console.log('Confirm ');
            console.log(this.item);

            this.EventService.delete(item.id).then(
                    (response) => {   
                      console.log('Remove successful');
                      console.log(response.data);

                      // notify the user
                      var toast = this.$mdToast.simple()
                        .textContent(`Deleted event ${item.name}`)
                        .position('bottom center')
                        .parent();
                      $(`#event-${item.id}`).remove();
                      this.$mdToast.show(toast);
                      this.$state.go('dashboard.events');

                    },
                    (error) => {

                      message = error.data.message;

                      // notify the user operation failed
                      var toast = this.$mdToast.simple()
                        .textContent(message)
                        .position('bottom center')
                        .parent();

                      this.$mdToast.show(toast);

                      console.log('Error removing event.');
                      console.log(error);
                    }
                );

          },
          // user canceled delete
          () => {
            console.log('Cancelled delete item.');
          }
      );



    return this.EventService.save(this.item).then(
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

          console.log('Error saving event data.');
          console.log(error);
        }
    );
  }
  
  
}