import groupMemberRoleOptions from '../../assets/json/formOptions/group.member.role.json';


export default class DashboardGroupMembersAddMembersController {
  constructor(GroupService, AppDataService, $cookies, $mdDialog, $mdToast, $state, $stateParams, $http, locals) {
    'ngInject';
    
    this.GroupService = GroupService;
    this.AppDataService = AppDataService
    this.$mdDialog = $mdDialog;
    this.$mdToast = $mdToast;
    this.$http = $http;

    this.groupMemberRoleOptions = groupMemberRoleOptions;
    
    this.context = "dashboard.group.members.addMembers";
    this.errors = [];

    this.selectedItem  = null;
    this.searchText    = null;

    this.group = locals.group;
    this.item = {group_id: locals.group.id};

    console.log('Locals:');
    console.log(locals);
    
  }
  


  /*
   * Search through list of countries
   * */
  querySearch(query) {
    var o = this.AppDataService.organization;
    return this.$http.get(`api/v1/organizations/${o.id}/members/`, { 'query':query } )
      .then( 
          (response) => {
            console.log(response.data);
            return response.data;
          }
      );
  }

  selectedItemChange(member) {
    console.log('Selected item change.');
    console.log(member);
    this.item.person_id = member.person.id;
  }

  save() {

      console.log( 'Saving' );
      console.log( this.item );

      // Retrieve group members
      this.GroupService.addMember(this.item).then(
          (response) => {
            console.log('Member added.');
            this.$mdDialog.hide(this.item);
          },
          (error) => {
            console.log('Could not add member to group.');
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


