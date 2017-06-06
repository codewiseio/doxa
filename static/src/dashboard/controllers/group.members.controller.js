export default class DashboardGroupController {
  constructor(GroupService, AppDataService, $cookies, $mdDialog, $mdToast, $state, $stateParams, $http) {
    'ngInject';
    
    this.GroupService = GroupService;
    this.AppDataService = AppDataService;
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    this.$http = $http;
    
    this.context = "dashboard.group.members";
    this.errors = [];
    
    this.initPage();    
  }
  
  initPage() {
    this.AppDataService.pageType = "component";

    this.organization = JSON.parse(this.$cookies.get('organization'));

    let id = this.$stateParams.id;

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
        if ( item ) this.members.unshift(item);
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
        this.items.unshift(item);
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

            this.GroupService.removeMember(item.id).then(
                    (response) => {   
                      console.log('Remove successful');
                      console.log(response.data);

                      // notify the user
                      var toast = this.$mdToast.simple()
                        .textContent(`Removed ${item.person.first_name} from group`)
                        .position('bottom center')
                        .parent();

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
  
}


