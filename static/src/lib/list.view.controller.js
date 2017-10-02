export default class ListViewController {

    constructor(service=undefined, $mdDialog=undefined, $mdToast=undefined, SweetAlert=undefined) {
      this.service = service;
      this.$mdDialog = $mdDialog;
      this.$mdToast = $mdToast;
      this.SweetAlert = SweetAlert;

      this.filter = {};
      this.items = [];
      this.selectedItems = [];
    }


     /**
     * Opens a dialog to create a new item
     * @param  {object} $item   The item to be edited
     * @param  {event} $event   The event triggering the dialog to open
     */
    new(item=null, $event=null) {
      if ( ! item ) item = { };
      return this.edit(item, $event);
    }

    /**
     * Copies an item and opens dialog for editing
     * @param  {object} $item   The item to be edited
     * @param  {event} $event   The event triggering the dialog to open
     */
    copy(item, $event=null) {
      let copy = angular.copy(item);
      copy.id = null;
      return this.edit(copy, $event);
    }

    /**
     * Opens a dialog to edit an item
     * @param  {object} $item   The item to be edited
     * @param  {event} $event   The event triggering the dialog to open
     */
    edit(item, $event=null) {
      alert('Over ride this function.');
    }

  /**
   * Sort the list by the given field name
   * @param  {String}
   */
  sortBy(field='first_name') {
    console.log('Sorting by '+field);
    this.sortOrder = field;
    this.refreshResults();
  }

  /**
   * Check if the current list item is selected
   * @param  {item} The list item to test
   * @return {Boolean} True if item is selected
   */
  isItemSelected(item) {
    return this.selectedItems.indexOf(item) > -1;
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
    this.checkAllItemsSelected();
  }

  /**
   * Check if all items in the list are selected
   * @return {bool} True if all items are selected
   */
  checkAllItemsSelected() {
    console.log('Checking if all items selected.');
    if ( this.items.length && this.selectedItems.length == this.items.length ) {
      this.allItemsSelected = true;
    }
    else {
      this.allItemsSelected = false;
    }
  }

  /**
   * Check or uncheck all items in the list view
   * @return {[type]}
   */
  toggleAll() {
    console.log('Toggle all items.')
    console.log(this);
    var selectedItems = [];

    // select all items
    if ( ! this.allItemsSelected ) {
      this.items.forEach( function(item) {
        selectedItems.push(item);
      });
    }

    this.selectedItems = selectedItems;
    this.checkAllItemsSelected();
  }

  /**
   * Edit item
   * @return {[type]} [description]
   */
   editItem(item, params={}, $event) {
    let newItem = item.id ? false : true;

    // make a copy of the item before passing to the dialog
    item = angular.copy(item);

    let defaultParams = {
          locals: { "item": item },
          clickOutsideToClose:true,
          fullscreen: true,
          parent: angular.element(document.body),
          targetEvent: $event,
    };

    params = {...params, ...defaultParams};

    return this.$mdDialog.show( {...params, ...defaultParams} )
        .then(
          (savedItem) => {
            // if and item was returned the action completed successfuly
            if ( savedItem ) {
               
               // add new items to the list
               if ( newItem) {
                this.items.unshift(savedItem)
               }
               // update stale item with saved copy
               else {
                var idx = this.items.indexOf(item);
                this.items.splice(idx, 1,savedItem);
               }

              // notify the user
              var toast = this.$mdToast.simple()
                .textContent("Saved" )
                .position('bottom center')
                .parent();
              this.$mdToast.show(toast);

              return savedItem;

            }
        }, (error) => {
            console.log('error');
        });
   }

  /**
   * @return {obj} Hash of filter parameters
   */
  getFilterParams() {
    var params = {};
    params.sortOrder = this.sortOrder;
    params.filter = this.filter;
    return params;
  }



  promptAndDelete(item, params={}, undo=undefined) {
    params.objectStr    = params.objectStr    || `this item`;
    params.title        = params.title        || `Really remove ${params.objectStr}?`;
    params.confirmTitle = params.confirmTitle || `Removed!`;
    params.confirmText  = params.confirmText  || `Deleted ${params.objectStr}`;
    params.failTitle    = params.failTitle    || `Could not delete ${params.objectStr}`;
    params.service      = params.service      || this.service;


    return new Promise( 
        (resolve,reject) => {

          this.SweetAlert.swal({
                title: params.title,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete',
                cancelButtonText: 'No, keep',
                confirmButtonClass: "btn btn-success",
                cancelButtonClass: "btn btn-danger",
                buttonsStyling: false
            }).then(
              () => {
                // perform the delete operation
                params.service.delete(item.id).then(
                    (response) => {

                        console.log('Deleted item');
                        console.log(response);

                        // remove the item from the list
                        var idx = this.items.indexOf(item);
                        this.items.splice(idx, 1);

                        this.notify(params.confirmText, undo, response.data);
                        resolve(response);

                        // // display a message to the user
                        // this.SweetAlert.swal({
                        //   title: params.confirmTitle,
                        //   text:  params.confirmText,
                        //   type: 'success',
                        //   confirmButtonClass: "btn btn-success",
                        //   buttonsStyling: false
                        // })

                        return true;
                    },
                    (error) => {
                        var message = error.data.message;
                        this.SweetAlert.swal({
                          title: params.failTitle,
                          text: message,
                          type: 'error',
                          confirmButtonClass: "btn btn-info",
                          buttonsStyling: false
                        });
                        reject(error);
                        return false;
                    }
                );
              },
              (dismiss) => {
                // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                if (dismiss === 'cancel') {
                    return false;
                }
              }
            );

        }
      );

     
  }

  /**
   * Notify the user of a completed action with option to undo
   * @param  {[type]} text [description]
   * @param  {[type]} undo [description]
   * @return {[type]}      [description]
   */
  notify(text, undo=undefined, data=undefined) {
    var toast = this.$mdToast.simple()
      .textContent(text)
      .highlightAction(true)
      .highlightClass('md-accent')
      .position('bottom left');

    if( undo ) {
      toast.action('UNDO');
    }

    return this.$mdToast.show(toast).then( (action) => {
      if( action == "ok" ) {
        console.log('Calling undo action with data:');
        console.log(data);
        return undo(data);
      }
    });
  } 

}