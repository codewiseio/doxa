import memberInvolvementOptions from '../assets/json/formOptions/member.involvement.json';
import EditDialogController from '../lib/edit.dialog.controller';



export default class MemberEditDialogController extends EditDialogController {
  
  constructor(MemberService, $mdDialog, $mdToast, locals, AppDataService, $http) {
    'ngInject';
    super(MemberService, $mdDialog, $mdToast, locals);

    this.AppDataService = AppDataService;
    this.context = "task.edit";
    
    if ( ! this.item ) this.item = { person: {} };
    if ( ! this.item.person  ) this.item.person =  {};
  }

  build_options() {
    this.options = {
      memberInvolvement: memberInvolvementOptions
    }
  }
 

}