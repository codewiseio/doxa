export default class ItemController {

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
   * @return {obj} Hash of filter parameters
   */
  getFilterParams() {
    var params = {};
    params.sortOrder = this.sortOrder;
    params.filter = this.filter;
    return params;
  }

  promptAndDelete(item, params) {
    this.SweetAlert.swal({
                title: params.title,
                // text: params.text,
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
                this.GroupService.removeMember(item).then(
                    (response) => {
                        // remove the item from the list
                        var idx = this.items.indexOf(item);
                        this.items.splice(idx, 1);

                        // display a message to the user
                        this.SweetAlert.swal({
                          title: 'Removed!',
                          text: `${item.person.first_name} ${item.person.last_name} has been removed.`,
                          type: 'success',
                          confirmButtonClass: "btn btn-success",
                          buttonsStyling: false
                        })
                    },
                    (error) => {
                        var message = error.data.message;
                        this.SweetAlert.swal({
                          title: `Could not delete ${item.name}`,
                          text: message,
                          type: 'error',
                          confirmButtonClass: "btn btn-info",
                          buttonsStyling: false
                        })
                    }
                );
              },
              (dismiss) => {
                // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
                if (dismiss === 'cancel') {

                }
              }
            );
  }

}