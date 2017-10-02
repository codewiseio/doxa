
import ListViewController from '../lib/list.view.controller.js';

export default class TasksController extends ListViewController {
  constructor(TaskService, GroupService, EventService, AppDataService, SweetAlert, $mdDialog, $mdToast, $mdMenu, $http,  $scope) {
    'ngInject';
    super(TaskService, $mdDialog, $mdToast, SweetAlert);
    
    this.AppDataService = AppDataService;
    this.GroupService = GroupService;
    this.EventService = EventService;

    this.$mdMenu = $mdMenu;
    this.$http = $http;
    
    this.context = "dashboard.tasks";
    this.errors = 

    this.selectedItem = null;
    this.searchGroupOrEventText = null;

    this.organization = this.AppDataService.organization;


    // $scope.$watch( '$ctrl.searchGroupOrEventText',
    //   function (newValue) {
    //     $scope.$ctrl.mode = newValue;
    //   }
    // );


    this.initPage();    
  }
  

  /**
   * Retrieves the currently active organization as an object.
   */
  initPage() {

      // get currently set organization
      this.refreshResults();

      // add place holder to search group or event field
      setTimeout( function() {
        $('.search-group-or-event input').attr('placeholder','Group or Event');
      }, 500);
      
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
      );
    }


    /**
     * Delete an item
     * @param  Object item  Item to delete
     */
    delete(item, event) {

      let objectStr = `${item.label}`;
      let params = {
          objectStr: objectStr,
          service: this.service
      };

      this.promptAndDelete(item, params);
    }


    assignTo(item,person) {
      this.selectedMemberText = "";
      this.selectedMember = null;
      this.service.assignTo(item,person).then( 
        (response) => {
            let assignee = response.data;
            item.assignees.push(assignee);
        },
        () => {
            // display an error message
            
        });
    }

    removeAssignee(item,assignee) {
      this.service.removeAssignee(assignee).then(
          /** received positive response */
          (response) => {
              var idx = item.assignees.indexOf(assignee);
              if (idx > -1) {
                item.assignees.splice(idx, 1);
              }

              this._showAssigneeRemovedToast(item,assignee,idx);

              let undo = {
                item: response.data,
                idx: idx
              };
          },
          (error) => {

          }
      );
    }

    _showAssigneeRemovedToast(item, assignee, position) {
      var toast = this.$mdToast.simple()
        .textContent(`Removed ${assignee.person.first_name} ${assignee.person.last_name}`)
        .action('UNDO')
        .highlightAction(true)
        .highlightClass('md-accent')
        .position('bottom left');

        this.$mdToast.show(toast).then( (action) => {
          if( action == "ok" ) {
            this.service.undoRemoveAssignee(assignee).then(
              (response) => {
                  let assignee = response.data;
                  item.assignees.splice(position,0,assignee);
              },
              (error) => {

              });
          }
        });
    }

    addBullet(item,label) {
      item.bullet_points.push(label);
      let data = { id: item.id, bullet_points: item.bullet_points };
      item._add_bullet_text = '';

      this.service.save(data).then(
        (response) => {
            // item.bullet_points = item.bullet_points + "\n" + label;
            // item.assignees.push(assignee);
        },
        () => {
            
        });
    }

    removeBullet(item,index) {
      item.bullet_points.splice(index,1);
      let data = { id: item.id, bullet_points: item.bullet_points };

      this.service.save(data).then(
        (response) => {
            // item.bullet_points = item.bullet_points + "\n" + label;
            // item.assignees.push(assignee);
        },
        () => {
            
        });
    }



    removeBulletPoint(item,bullet_point) {
      
      var idx = item.bullet_points.indexOf(assignee);
      if (idx > -1) {
        item.bullet_points.splice(idx, 1);
      }

      let newValue = item.bullet_points.join("\n");
      this.service.save(item).then(
          /** received positive response */
          (response) => {

          },
          (error) => {

          }
      );
    }

    /*
    * Search through list of eligible members
    * */
    querySearchMembers(query) {
      var o = this.AppDataService.organization;
      console.log('Query Search');
      console.log(query);

      return this.$http.get(`api/v1/organizations/${o.id}/members/`, 
        { 
          params: { 'query':query, context: this.context } 
        } )
        .then( 
            (response) => {
              console.log(response.data);


              return response.data;
            }
       );
    }






    /*
    * Search through list of eligible members
    * */
    querySearch(query) {
      var o = this.AppDataService.organization;
      console.log('Query Search');
      console.log(query);

      return this.$http.get(`api/v1/search/organization:${o.id}/`, 
        { 
          params: { 'query':query, context: this.context } 
        } )
        .then( 
            (response) => {
              console.log(response.data);
              return response.data;
            }
       );
    }

    searchGroupOrEventChanged(item) {
        console.log('Search group or event change.');
        this.filter.group = null;
        this.filter.event = null;

        if ( item._entity_ == 'group' ) {
            this.filter.group = item.id;
        }
        if ( item._entity_ == 'event' ) {
            this.filter.event = item.id;
        }

        this.refreshResults();
    }


      expandItem(item) {
        if ( this.activeTask )
          { this.activeTask.expand = false };

        // if clicking on currently active task
        // collapse and set active task to none
        if ( this.activeTask && this.activeTask.id == item.id ) {
          item.expand = false;
          this.activeTask = null;
        }

        // otherwise, expand and set active
        else {
          this.activeTask = item;
          item.expand = true;
        }


      }


      // selectedItemChange(member) {
      //   console.log('Selected item change.');
      //   console.log(member);
      //   this.item.person_id = member.person.id;
      // }

    /**
     * Opens a dialog to edit event.
     * @param  {object} $item   The item to be edited
     * @param  {event} $event   The event triggering the dialog to open
     */
    toggleCompleted(task, assignee, $event) {
      $event.stopPropagation();
      

      // edit a copy of the assignee
      let copy = {};
      angular.copy(assignee,copy);
      copy.completed = copy.completed ? false : true;

      // update the database
      this.service.updateAssignee(copy).then(
          (response) => {
            console.log(response);
            assignee.completed = copy.completed;
            copy.completed ? task.count_completed++ : task.count_completed--;
          }
        );
    }


    /**
     * Refresh the currently displayed results. Called after filter changes and page load.
     */
    refreshResults() {

      this.retrieveGroups();
      this.retrieveEvents();

      var params = this.getFilterParams();
      params.filter.organization = this.AppDataService.organization.id;
      console.log(params);

      // Retrieve record data
      this.service.list(params).then(
          (response) => {
            console.log('Retrieved tasks:',response)
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
     * Retrieve groups
     */
    retrieveGroups(params={ filter: {} }) {
      params.filter = params.filter || {};
      params.filter.organization = this.AppDataService.organization.id;

      console.log('Retrieving groups.');
      this.GroupService.list(params).then(
          (response) => {
              console.log('Retrieved groups');
              console.log(response);
              this.groups = response.data;
          },
          (error) => {
              console.log('Error loading groups');
              console.log(error);
              this.notify('Error loading groups');
          }
      );
    }

    /** 
     * Retrieve groups
     */
    retrieveEvents(params={ filter: {} }) {
      params.filter = params.filter || {};
      params.filter.organization = this.AppDataService.organization.id;

      console.log('Retrieving events.');
      this.EventService.list(params).then(
          (response) => {
              console.log('Retrieved events');
              console.log(response);
              this.events = response.data;
          },
          (error) => {
              console.log('Error loading events');
              console.log(error);
              this.notify('Error loading events');
          }
      );
    }
}