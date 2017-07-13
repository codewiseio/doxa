import groupMemberRoleOptions from '../../assets/json/formOptions/group.member.role.json';


export default class DashboardGroupEditMemberController {
  constructor(GroupService, AppDataService, $cookies, $mdDialog, $mdToast, $state, $stateParams, $http, locals) {
    'ngInject';
    
    this.GroupService = GroupService;
    this.AppDataService = AppDataService
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.$http = $http;

    this.groupMemberRoleOptions = groupMemberRoleOptions;
    
    this.context = "dashboard.group.members.edit";
    this.errors = [];

    this.selectedItem  = null;
    this.searchText    = null;

    this.group = locals.group;
    this.item = locals.item;
    
  }

  save() {

      console.log( 'Saving' );
      console.log( this.item );
      console.log('Check');

      // Retrieve group members
      this.GroupService.updateMember(this.item).then(
          (response) => {
            console.log('Member updated.');
            var savedItem = response.data;
            console.log(savedItem);
            this.$mdDialog.hide(savedItem);
          },
          (error) => {
            console.log('Could not update members.');
            var message = error.data.message;
            var toast = this.$mdToast.simple()
              .textContent(message)
              .position('top right')
              .parent();
            this.$mdToast.show(toast);
          }
      );
  }

  cancel() {
      this.$mdDialog.hide();
  }
  
}


