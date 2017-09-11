import ListViewController from '../../common/list.view.controller.js';
import memberInvolvementOptions from '../../assets/json/formOptions/member.involvement.json';



export default class DashboardGroupMembersController extends ListViewController {
  constructor(GroupService, AppDataService, SweetAlert, $cookies, $mdDialog, $mdToast, $state, $stateParams, $http, $scope) {
    'ngInject';
    super();
    this.GroupService = GroupService;
    this.AppDataService = AppDataService;
    this.SweetAlert = SweetAlert;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    this.$http = $http;
    this.$scope = $scope;

    this.context = "dashboard.group.members";
    this.errors = [];

    this.items = [];
    this.selectedItems = [];
    this.allItemsSelected = false;
    this.filter = {};

    this.enum = {
      'involvement' : AppDataService.enumerate(memberInvolvementOptions)
    }

    this.initPage();
  }

  initPage() {
    this.AppDataService.pageType = "component";

    this.organization = JSON.parse(this.$cookies.get('organization'));

    let id = this.$stateParams.id;
    this.itemId = id;

    // Retrieve record data
    this.GroupService.get(id).then(
        (response) => {
          this.item = response.data;
          this.AppDataService.pageTitle = `${this.item.name} Members`;
          this.AppDataService.previousState = `dashboard.members({id: ${this.item.id}})`;
          this.refreshResults();
        },
        (err) => {
          console.log('Error fetching group.');
          console.log(error);
          var toast = this.$mdToast.simple()
            .textContent(error.data.message)
            .position('top right')
            .parent();
          this.$mdToast.show(toast);
        }
    );

  }


  /**
   * Display a dialog to add a member to the group
   */
  new() {

     var $http = this.$http;
     var o = this.AppDataService.organization;

    this.$mdDialog.show({
        controller: 'DashboardGroupAddMembersController as $ctrl',
        templateUrl: 'dashboard.group.member.add.html',
        clickOutsideToClose: true,
        fullscreen: false,
        locals: {
          group: this.item
        }
    })
    .then(
      (item) => {
        if ( item ) {
          // add member to the list
          this.items.unshift(item);
          console.log(item);

          // display notice
          var toast = this.$mdToast.simple()
            .textContent(`${item.person.first_name} ${item.person.last_name} added to the group`)
            .position('bottom center')
            .parent();

          this.$mdToast.show(toast);
        }
      },
      (error) => {

      }
    )
  }

  /**
   * Display a dialog to add a member to the group
   */
  edit(member, event) {

    console.log(member);

    this.$mdDialog.show({
        controller: 'DashboardGroupEditMemberController as $ctrl',
        templateUrl: 'dashboard.group.member.edit.html',
        clickOutsideToClose: true,
        fullscreen: false,
        locals: {
          group: this.item,
          item: member
        }
    })
    .then(
      (item) => {

      },
      (error) => {

      }
    )
  }

/**
   * Delete group member
   * @param  {[type]} item  [description]
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  delete(item, event) {
    let objectStr = `${item.person.first_name} ${item.person.last_name}`;
    let params = {
        objectStr: objectStr,
        title: `Really remove ${objectStr}?`,
        confirmText: `${objectStr} has been removed.`,
        failText: `Could not delete ${item.name}`,
        service: this.GroupService
    };

    alert(params);

    // this.promptAndDelete(item, params);
    

    this.SweetAlert.swal({
            title: `Really remove ${item.person.first_name} ${item.person.last_name}?`,
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


  removeMembers($event) {

    // confirm
    var confirm = this.$mdDialog.confirm()
            .title(`Really remove members?`)
            .ariaLabel('Really remove these member?')
            .targetEvent($event)
            .ok(`Yes, remove`)
            .cancel('No, keep in group')
            .multiple(true);

    // make ajax call to django

      this.$mdDialog.show(confirm).then(
        // user confirmed delete
        () => {

          var nMembers = this.selectedItems.length;

          this.GroupService.removeMembers(this.selectedItems).then(
                  (response) => {
                    console.log('Remove successful');
                    console.log(response.data);

                    // notify the user
                    var toast = this.$mdToast.simple()
                      .textContent(`Removed ${nMembers} from group`)
                      .position('bottom center')
                      .parent();

                   this.$mdToast.show(toast);

                   var deleted_items = this.selectedItems;
                   deleted_items.forEach(function(member) {
                         $(`#member-${member.id}`).remove();
                   });



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
    // display toast

    // remove items from the list
  }

  refreshResults() {

    console.log('Refreshing');

    var params = {};
    params.sortOrder = this.sortOrder;
    params.filter = this.filter;
    console.log(params);


    // Retrieve group members
    this.GroupService.getMembers(this.itemId, params).then(
        (response) => {
          console.log('Retrieved members.');
          console.log(response.data);
          this.items = response.data;
          console.log(this.items);
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


