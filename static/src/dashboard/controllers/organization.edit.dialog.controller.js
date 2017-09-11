
import organizationSizeOptions from '../../assets/json/formOptions/organization.size.json';


export default class OrganizationEditDialogController {
  constructor(OrganizationService, AppDataService, $stateParams, $mdDialog, $mdToast, $http) {
    'ngInject';
    
    this.service = this.OrganizationService = OrganizationService;

    this.AppDataService = AppDataService
    this.$mdToast = $mdToast;
    this.$mdDialog = $mdDialog;
    this.$stateParams = $stateParams;
    this.$http = $http;
    
    this.context = "organization.edit";
    this.errors = [];

    this.options = {
      organizationSize: organizationSizeOptions,
    }
    
    this.initPage();    
  }
  

  initPage() {
    this.organization = this.AppDataService.organization;

    this.id = this.organization.id;

    this.AppDataService.pageType = 'component';
    this.AppDataService.previousState = 'dashboard.home()';
    this.AppDataService.contextMenu = null;

    this.refresh();
  }


  /**
   * Close the dialog without making changes.
   */
  cancel() {
    this.$mdDialog.cancel();
  }



  /**
   * Reload data from database and refresh the page
   * @return Promise
   */
  refresh() {
    this.service.get(this.id, { context: this.context } ).then(
        (response) => {
          this.item = response.data;
          this.AppDataService.pageTitle = `${this.item.name}`;
        },
        (err) => {
          // TODO: Go to 404
          console.log('Error fetching data.');
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
   * Save changes to the item
   */
  save() {

    console.log(this.service);

    return this.OrganizationService.save(this.item).then(
        (response) => {   
          console.log('Save successful');
          console.log(response);
          var savedItem = response.data;
          this.$mdDialog.hide(savedItem);
        },
        (error) => {
          console.log('Error saving member data.');
          console.log(error);
          if ( error.status == 500) {
            message = 'Internal server error.';
          }
          else {
             message = error.data.message;
          }
         

          // notify the user operation failed
          var toast = this.$mdToast.simple()
            .textContent(message)
            .position('bottom center')
            .parent();
          this.$mdToast.show(toast);


        }
    );
  }
  
}