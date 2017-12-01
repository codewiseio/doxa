
/**
 * Abstract controller class for edit dialogs.
 */
export default class EditDialogController {

  constructor(service, $mdDialog, $mdToast, locals) {
      this.service = service;
      this.$mdDialog = $mdDialog;
      this.$mdToast = $mdToast;

      this.item = locals.item;
      if (this.item.id) {
        this.refreshItem();
      }

      this.build_options();
  }

  /**
   * Load a current copy of the selected item
   * return Object A fresh copy of the item from the database
   */
  refreshItem() {
      this.service.get(this.item.id).then(
            (response) => {
                
                this.item = response.data;
                console.log('Item refreshed.');
                console.log(this.item);
            },
            (error) => {
                console.log('Could not refresh item.');
                console.log(error);
            }
        );
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
  save(item=this.item) {
  
    console.log('Saving');
    console.log('item',item);


    return this.service.save(item).then(
        (response) => {   
          console.log('Save successful');
          console.log(response);
          var savedItem = response.data;
          this.$mdDialog.hide(savedItem);
        },
        (error) => {
          console.log('error',error);
        }
    );
  }


  /**
   * Abstract method. Override to populate the options for use in forms.
   */
  build_options() {

  }


}