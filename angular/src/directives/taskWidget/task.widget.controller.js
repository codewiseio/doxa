
import ListViewController from '../../lib/list.view.controller.js';


export default class TaskWidgetController  extends ListViewController {
  constructor(TaskService, $mdDialog, $mdToast, SweetAlert, $parse, $attrs, $scope) {
    'ngInject';
    super(TaskService, $mdDialog, $mdToast, SweetAlert);

        
    this.$parse = $parse;
    this.$attrs = $attrs;
    this.$scope = $scope;    
    
    this.items  = [];
    this.errors = [];
    this.viewAllItems = false;
  }
  

  /**
   * Refresh the content of the widget
   * @return Promise
   */
  refresh() {
      console.log('Refreshing task widget.');

      // clear items if no entity set
      if ( ! this.entity ) {
        this.items = [];
        return;
      }

      // set filters for api query
      let params = { 'filter': {} };
      if ( ! this.viewAllItems ) {
        params.filter.archived = false;
      }
      

      if ( this.entity.__entity__ == 'event' ) {
        params.filter.event = this.entity.id;
      }
      if ( this.entity.__entity__ == 'group' ) {
        params.filter.group = this.entity.id;
      }


      // Retrieve record data
      this.service.list(params).then(
          (response) => {
            console.log('Retrieved tasks:',response)
            this.items = response.data;
          },
          (err) => {
            var toast = this.$mdToast.simple()
              .textContent(error.data.message)
              .position('bottom left')
              .parent();

            this.$mdToast.show(toast);
          }
      );  
    }

    new(item={}, $event=null) {
        item.entity = this.entity;
        if ( item.entity.__entity__ == 'group') {
            item.group = item.entity;
        }
        else if (  item.entity.__entity__ == 'event' ) {
            item.event = item.entity;
        }
        super.new(item, $event).then( (savedItem) => {
            console.log('Expansion pack.');

            // resort the items as the new item may be out of order
            this.resort();

            // set the new item as the active item
            if( savedItem ) {
              this.expandItem(savedItem);
            }
            
        });
    }

    /**
     * Opens a dialog to edit an item
     * @param  {object} $item   The item to be edited
     * @param  {event} $event   The event triggering the dialog to open
     */
    edit(item, $event=null) {
      return this.editItem(item, 
        {
          controller: 'TaskEditDialogController as $ctrl',
          templateUrl: 'task.edit.dialog.html',
          targetEvent: $event
        },
      ).then( (savedItem) => {
            // resort the objects as the edit may have affected due/dates order
            this.resort();

            // set the new item as the active item
            if( savedItem ) {
              this.expandItem(savedItem);
            }

            
      });
    }


    /**
     * Delete an item
     * @param  Object item  Item to delete
     */
    delete(item, event) {

      // find item position
      var pos = this.items.indexOf(item);

      let objectStr = `${item.label}`;
      let params = {
          objectStr: objectStr,
          service: this.service
      };

      let undo = (backup) => {
          delete backup['count_assigned'];
          delete backup['count_completed'];
          delete backup['entity'];
          delete backup['__entity__'];
          return this.service.create(backup).then( (response) => {
              let restoredItem = response.data;
              this.items.splice(pos,0,restoredItem);
              this.activeItem = restoredItem;
          });
      };

      return this.promptAndDelete(item, params, undo).then( (response) => {
          this.activeItem = null;
      });
    }

    /**
     * Archive an item
     * @param  Object item  [description]
     * @param  {[type]} event [description]
     * @return {[type]}       [description]
     */
    archive(item, event) {

      // find item position
      var idx = this.items.indexOf(item);

      // data to send to the api
      let data = {
        "id": item.id,
        "archived": true
      }

      // build the undo function
      let undo = (data) => {
          
          return this.service.update(data).then( (response) => {
              // add the item back into the list
              let restoredItem = response.data;
              this.items.splice(idx,0,restoredItem);
              this.activeItem = restoredItem;
          },
          (error) => {
              this.notify('Could not undo this action.');
              console.log(error);
          });
        };

      return this.service.update(data).then( 
        (response) => {
          // remove item from the widget
          this.items.splice(idx,1);

          // notify the user
          let data = {
            "id": item.id,
            "archived": false
          };
          return this.notify(`Archived`, undo, data);
        },
        (error) => {
          return this.notify(`Could not archive.`)
        });

        
    }

    
    /**
     * Copies an item and opens dialog for editing
     * @param  {object} $item   The item to be edited
     * @param  {event} $event   The event triggering the dialog to open
     */
    copy(item, $event=null) {
      let copy = angular.copy(item);
      copy.id = null;
      copy.assignees = [];
      copy.due_date = undefined;
      copy.archived = false;
      this.edit(copy, $event);
    }

    /**
     * Toggle an assignee as having completed a task
     * @param  Object task     Task working on
     * @param  Object assignee Assignee completing task
     * @param  Object $event   DOM event triggering the action
     * @return Promise
     */
    toggleAssigneeCompleted(task, assignee, $event) {
      $event.stopPropagation();
      
      // edit a copy of the assignee
      let copy = {};
      angular.copy(assignee,copy);
      copy.completed = copy.completed ? false : true;

      // update the database
      return this.service.updateAssignee(copy).then(
          (response) => {
            console.log(response);
            assignee.completed = copy.completed;
            copy.completed ? task.count_completed++ : task.count_completed--;
          }
        );
    }

    /**
     * Toggle an assignee as having completed a task
     * @param  Object task     Task working on
     * @param  Object assignee Assignee completing task
     * @param  Object $event   DOM event triggering the action
     * @return Promise
     */
    // toggleTaskCompleted(item, $event) {

    //   // find item position
    //   var pos = this.items.indexOf(item);


    //   // get all assignees who have not completed the task
    //   let incomplete = [];
    //   item.assignees.forEach( (element) => {
    //     if( ! element.completed ) {
    //        incomplete.push({id: element.id, completed: true});
    //     }
    //   });

    //   // create data for api
    //   let data = {
    //     id: item.id,
    //     assignees: incomplete
    //   };


    //   // create undo action
    //   let undo = () => {
    //       // undo data
    //       let undoData = angular.copy(data);
    //       undoData.foreach( (element) => {
    //           element.completed = false;
    //       });

    //       return this.service.update(undoData).then(
    //           (response) => {

    //             // determine assignees to mark is incomplete
    //             let undid = {};
    //             undoData.forEach( (element) => {
    //                 undid[element.id] = true;
    //             });

    //             // remove complete mark from appropriate elements
    //             item.assignees.forEach( (element) => {
    //               if (undid[element.id]) element.completed = false;
    //             });

    //             // task marked as completed
    //             console.log("Undone");
    //             console.log(response);
    //           },
    //           (error) => {
    //               console.log(error);
    //               this.notify('Could not undo')
    //           }
    //         );
    //   };

    //   // update the database
    //   return this.service.update(data).then(
    //       (response) => {

    //         // mark assignees as completing
    //         item.assignees.forEach( (element) => {
    //           element.completed = true;
    //         });

    //         // task marked as completed
    //         console.log("Task marked complete.");
    //         console.log(response);
    //         this.notify("Task marked complete", undo);
    //       }
    //     );
    // }

    /**
     * Expand or contract the activated item
     * @param  The selected item
     */
    expandItem(item) {
      if ( this.activeItem && this.activeItem != item ) {
        // this.activeItem.expand = false;
      }
      
      this.activeItem = item;
      // this.activeItem.expand = true;
    }

    toggleExpanded(item) {
      // if clicking on the currently active task
      if ( this.activeItem && this.activeItem == item ) {
        // collapse and set active task to none
        // item.expand = false;
        this.activeItem = null;
      }

      else {
        this.expandItem(item);
      }
    }

    toggleViewAllItems() {
      this.viewAllItems = !this.viewAllItems;
      this.refresh();
    }


 /**
   * Check if all items in the list are selected
   * @return {bool} True if all items are selected
   */
  checkCompleted() {
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


  resort() {

    function compare(a,b) {

      if ( ! a.due_date && ! b.due_date )
        return 0;

      if ( ! a.due_date )
        return -1;

      if ( ! b.due_date )
        return 1;

      if (a.due_date < b.due_date)
        return -1;

      if (a.due_date > b.due_date)
        return 1;

      return 0;
    }

    this.items = the.items.sort(compare);


  }



  
}
