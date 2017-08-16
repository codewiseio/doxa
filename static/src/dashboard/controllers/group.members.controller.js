import ListViewController from '../../common/list.view.controller.js';
export default class DashboardGroupMembersController extends ListViewController {
  constructor(GroupService, AppDataService, $cookies, $mdDialog, $mdToast, $state, $stateParams, $http, $scope) {
    'ngInject';
    super();
    this.GroupService = GroupService;
    this.AppDataService = AppDataService;
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


  buildMenu() {
        this.contextMenu = {
          controller: this,
          menuItems: [
            {
                label: 'Remove Selected',
                type: 'method',
                icon: 'remove',
                action: "$ctrl.contextMenu.controller.removeMembers()"
            },
            {
                type: 'divider',
            },
            {
                label: 'Name',
                type: 'method',
                icon: '',
                action: "$ctrl.contextMenu.controller.sortyBy('name')"
            },
            {
                label: 'Role',
                type: 'method',
                icon: '',
                action: "$ctrl.contextMenu.controller.sortBy('role')"
            },
            {
                label: 'Join Date',
                type: 'method',
                icon: '',
                action: "$ctrl.contextMenu.controller.sortBy('join_date')"
            },
          ]
        };



        this.AppDataService.contextMenu = this.contextMenu;
  }

  /**
   * Display a dialog to add a member to the group
   */
  addMember() {

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
  editMember(member, event) {

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

  removeMember(item, $event) {
     // Appending dialog to document.body to cover sidenav in docs app
      var confirm = this.$mdDialog.confirm({ multiple: true, locals: {item: item } })
            .title(`Really remove this member?`)
            .textContent(`${item.person.first_name} ${item.person.last_name}`)
            .ariaLabel('Really remove this member?')
            .targetEvent($event)
            .ok(`Yes, remove ${item.person.first_name}`)
            .cancel('No, keep in group')
            .multiple(true);

      this.$mdDialog.show(confirm).then(
          // user confirmed delete
          () => {

            console.log('Confirm ');
            console.log(this.item);

            this.GroupService.removeMember(item).then(
                    (response) => {
                      console.log('Remove successful');
                      console.log(response.data);

                      // notify the user
                      var toast = this.$mdToast.simple()
                        .textContent(`${item.person.first_name} removed from group`)
                        .position('bottom center')
                        .parent();

                      this.$mdToast.show(toast);
                     $(`#member-${item.id}`).remove();

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


