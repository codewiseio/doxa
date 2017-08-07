export default class EventEditDialogController {
  
  constructor(EventService, $mdDialog, $mdToast, $state, $filter, locals) {
    'ngInject';
    
    this.EventService = EventService;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.$state = $state;
    this.$filter = $filter;
    
    this.context = "dashboard.event.edit";
    this.item = locals.item;
    
    this.currentDate =  moment();

    this.displayEndTime = false;
    this.event_name = true;

    if ( ! this.item ) this.item = {  };


    if(!locals.item.end_date){
      this.ShowEndDateDialog = false;
    }else{
      this.ShowEndDateDialog = true;
    }
  
  }
  
  removeEndDate(){
    this.item.end_time = '';
    this.ShowEndDateDialog = false;
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
  save(id) {
  
    console.log('Saving');
    console.log('item',this.item);

    if(id === undefined){
      if(this.item.start_time){
        var start_time = this.$filter('date')(this.item.start_time, 'HH:mm:ss');
      }
      if(this.item.end_time){
        var end_time = this.$filter('date')(this.item.end_time, 'HH:mm:ss');
      }
    }
    else{
      if(this.item.start_time){
        var start_time = this.item.start_time.format('HH:mm:ss');
      }
      if(this.item.end_time){
        var end_time = this.item.start_time.format('HH:mm:ss');
      }
    }

    console.log('start',start_time,'end',end_time)
    this.item.start_time = start_time
    this.item.end_time = end_time
    console.log('new_item',this.item)
    return this.EventService.save(this.item).then(
        (response) => {   
          console.log('Save successful');
          console.log(response);
          var savedItem = response.data;
          this.$mdDialog.hide(savedItem);
          var toast = this.$mdToast.simple()
            .textContent('Event Saved Successfully')
            .position('bottom center')
            .parent();
          this.$mdToast.show(toast);
        },
        (error) => {
          console.log('error',error);
          var message = error.data.name;
          // notify the user operation failed
          var toast = this.$mdToast.simple()
            .textContent(String(message))
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