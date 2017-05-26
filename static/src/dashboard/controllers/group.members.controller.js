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
        controller: 'DashboardGroupMembersAddMembersController as $ctrl',
        templateUrl: 'dashboard.group.member.edit.dialog.html',
        clickOutsideToClose: true,
        fullscreen: false,
        locals: {
          group: this.item
        }
    })
    .then( 
      (data) => {

      },
      (error) => {

      }
    )
  }
  
}

 // var DialogController = function($scope, $mdDialog) {
 //          $scope.hide = function() {
 //            $mdDialog.hide();
 //          };

 //          $scope.cancel = function() {
 //            $mdDialog.cancel();
 //          };

 //          $scope.answer = function(answer) {
 //            $mdDialog.hide(answer);
 //          };

 //          $scope.querySearch = function(query) {
 //            var lowercaseQuery = angular.lowercase(query);
 //            console.log(query);
 //            console.log(lowercaseQuery);
            
 //            return $http.get(`api/v1/organizations/${o.id}/members/`, { 'query':query } )
 //              .then( 
 //                  (response) => {
 //                    console.log(response.data);
 //                    return response.data;
 //                  }
 //              );
 //          }

 //          // selectedItemChange(item) {
 //          //   this.formData.country = item.value;
 //          // }
 //        };


