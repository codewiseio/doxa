export default class DashboardGroupController {
  constructor(GroupService, AppDataService, $cookies, $state, $stateParams, $mdToast, $http, FileUploader) {
    'ngInject';
    
    this.GroupService = GroupService;
    this.AppDataService = AppDataService
    this.$mdToast = $mdToast;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$cookies = $cookies;
    this.$http = $http;




    this.FileUploader = new FileUploader(
      { url: '/api/v1/upload/',
        alias: 'file',
        removeAfterUpload: true,
        headers: {
          'X-CSRFToken': $cookies.get('csrftoken'),
          'Content-Disposition': 'attachment; filename=upload.jpg'
        },
      }
    );
    
    this.context = "dashboard.group.edit";
    this.errors = [];
    
    this.initPage();    
  }
  
  initPage() {
    this.organization = JSON.parse(this.$cookies.get('organization'));

    let id = this.$stateParams.id;
    // if ( $state.current.name ! id ) $state.go('dashboard.editGroup');

    // if creating a new record
    if( ! id || id == "new" ) {
      this.AppDataService.pageTitle = `New group`;
      this.item = { 'organization' : this.organization.id };
    }
    // if editing a record
    else {
       this.AppDataService.pageTitle = `New group`;

      // Retrieve record data
      this.GroupService.get(id).then(
          (response) => {
            this.item = response.data;
            this.AppDataService.pageTitle = `${this.item.name}`;
          },
          (err) => {
            console.log('Error fetching data.');
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
          (err) => {
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
  
  /**
   * Save record
   * @return {Promise}
   */
  save() {
    this.GroupService.save(this.item).then(
        (response) => {          
          this.item = response.data;
          this.$state.go('dashboard.groups');
            var toast = this.$mdToast.simple()
              .textContent('New group created')
              .position('top right')
              .parent();
            this.$mdToast.show(toast);
          console.log('Saved');
        },
        (error) => {
          console.log('Error saving item.');
          console.log(error);
            var toast = this.$mdToast.simple()
              .textContent(error.statusText)
              .position('top right')
              .parent();
            this.$mdToast.show(toast);
        }
    );
  }
  
}