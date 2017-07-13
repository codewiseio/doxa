export default class DashboardHomeController {
  constructor(GroupService, AppDataService, $cookies, $state, $stateParams, $mdToast, $http, FileUploader) {
    'ngInject';
    
    this.GroupService = GroupService;
    this.AppDataService = AppDataService
    this.$mdToast = $mdToast;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    this.$http = $http;

    this.context = "dashboard.home";
    this.errors = [];
    
    this.initPage();    
  }
  
  initPage() {
    this.organization = this.AppDataService.organization;
    this.AppDataService.pageTitle = `Dashboard`;
    this.AppDataService.pageType = 'dashboard';
  }
  
}