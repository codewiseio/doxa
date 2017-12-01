import eventVisibilityOptions from '../assets/json/formOptions/event.visibility.json';
import EditDialogController from '../lib/edit.dialog.controller';



export default class EventEditDialogController extends EditDialogController  {
  
  constructor(EventService, $mdDialog, $mdToast, $state, $filter, locals) {
    'ngInject';
    super(EventService, $mdDialog, $mdToast, locals);
    this.$filter = $filter;
    this.build_options();
    
    this.context = "event.edit";

    
    this.currentDate =  moment();
    this.displayEndTime = false;


    this.event_name = true;

    if ( ! this.item ) this.item = { 'visibility': 1 };


    if(!locals.item.end_date){
      this.ShowEndDateDialog = false;
    }else{
      this.ShowEndDateDialog = true;
    }
  
  }

  build_options() {
    this.options = {
      'visibility':eventVisibilityOptions
    }
  }
  
  removeEndDate(){
    this.item.end_time = '';
    this.ShowEndDateDialog = false;
  }


  /**
   * Save changes to the item
   */
  save() {
  
    console.log('Saving');
    console.log('item',this.item);

    if(this.item.id === undefined){
      if(this.item.start_time){
        var start_time = this.$filter('date')(this.item.start_time, 'HH:mm:ss');
      }
      if(this.item.end_time){
        var end_time = this.$filter('date')(this.item.end_time, 'HH:mm:ss');
      }
    }
    else{
      if(this.item.start_time){
        var start_time = this.item.start_time.format('HH:mm:ss');
      }
      if(this.item.end_time){
        var end_time = this.item.start_time.format('HH:mm:ss');
      }
    }

    console.log('start',start_time,'end',end_time)
    this.item.start_time = start_time
    this.item.end_time = end_time
    console.log('new_item',this.item)
    return this.service.save(this.item).then(
        (response) => {   
          console.log('Save successful');
          console.log(response);
          var savedItem = response.data;
          this.$mdDialog.hide(savedItem);
        },
        (error) => {
          console.log('error',error);
        }
    );
  }

  
}