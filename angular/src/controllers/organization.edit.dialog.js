
import EditDialogController from '../lib/edit.dialog.controller';
import organizationSizeOptions from '../assets/json/formOptions/organization.size.json';


export default class OrganizationEditDialogController extends EditDialogController {
  constructor(OrganizationService, AppDataService, $mdDialog, $mdToast, $http, locals) {
    'ngInject';
    super(OrganizationService, $mdDialog, $mdToast, locals);


    this.AppDataService = AppDataService    
    this.context = "organization.edit";
    
    this.id = this.AppDataService.organization.id;
    this.refresh();  
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

}