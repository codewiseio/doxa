import EditDialogController from '../lib/edit.dialog.controller';

export default class GroupEditDialogController extends EditDialogController {
  
  constructor(GroupService, $mdDialog,  $mdToast, $state, locals) {
    'ngInject';
    super(GroupService, $mdDialog, $mdToast, locals);
  
    this.context = "group.edit";

    if ( ! this.item ) this.item = {  };
  }
  
 
}