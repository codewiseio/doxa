export default class DashboardGroupMembersController {
  constructor(GroupService, AppDataService, $cookies, $mdDialog, $mdToast, $state, $stateParams, $http, $scope) {
    'ngInject';

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

    this.members = [];
    this.selectedItems = [];
    this.allItemsSelected = false;

    console.log(this.$scope);

    var $this = this;
    this.$scope.$watch('$ctrl.selectedItems', function (newValue, oldValue, scope) {
        $this.checkAllItemsSelected();
    }, true);
    this.$scope.$watch('$ctrl.members', function (newValue, oldValue, scope) {
        $this.checkAllItemsSelected();
    }, true);



    this.filter = {};

    this.initPage();
  }

  initPage() {
    this.AppDataService.pageType = "component";

    this.organization = JSON.parse(this.$cookies.get('organization'));

    let id = this.$stateParams.id;
    this.groupId = id;

      // Retrieve record data
      this.GroupService.get(id).then(
          (response) => {
            this.item = response.data;
            this.AppDataService.pageTitle = `${this.item.name} Members`;
            this.AppDataService.previousState = `dashboard.members({id: ${this.item.id}})`;
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

      // Retrieve group members
      this.GroupService.getMembers(id).then(
          (response) => {
            this.members = response.data;
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
          this.members.unshift(item);

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

          nMembers = this.selectedItems.length;

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

  sortBy(field='first_name') {

    console.log('Sorting by '+field);

    this.sortOrder = field;
    this.refreshResults();

  }

  refreshResults() {

    console.log('Refreshing');


    var params = {};
    params.sortOrder = this.sortOrder;
    params.filter = this.filter;
    console.log(params);


    // Retrieve group members
    this.GroupService.getMembers(this.item.id, params).then(
        (response) => {
          this.members = response.data;
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


  isItemSelected(item) {
    return this.selectedItems.indexOf(item) > -1;
  }

  toggleItem(item) {
    var idx = this.selectedItems.indexOf(item);

    if (idx > -1) {
      this.selectedItems.splice(idx, 1);
    }
    else {
      this.selectedItems.push(item);
    }
  }

  checkAllItemsSelected() {
    if ( this.members.length && this.selectedItems.length == this.members.length ) {
      this.allItemsSelected = true;
    }
    else {
      this.allItemsSelected = false;
    }
  }

  toggleAll() {
    var selectedItems = [];

    // select all items
    if ( ! this.allItemsSelected ) {
      this.members.forEach( function(member) {
        selectedItems.push(member);
      });
    }

    this.selectedItems = selectedItems;
  }

}


