import EditDialogController from '../lib/edit.dialog.controller';


export default class TaskEditDialogController extends EditDialogController {
  
	constructor(TaskService, $mdDialog, $mdToast, locals, AppDataService, $http) {
		'ngInject';
		super(TaskService, $mdDialog, $mdToast, locals);

		this.AppDataService = AppDataService;
		this.context = "task.edit";

		this.assignees = [];

		this.$http = $http;

		this.item = this.item || { "organization_id": this.AppDataService.organization };

		var item = this.item;
		item.bullet_points = item.bullet_points || [];
		item.assignees = item.assignees || [];
	}





	/*
	* Search through list of eligible members
	* */
	querySearch(query) {
		var o = this.AppDataService.organization;
		console.log('Query Search');
		console.log(query);

		return this.$http.get(`api/v1/organizations/${o.id}/members/`, 
		  { 
		    params: { 'query':query, context: this.context } 
		  } )
		  .then( 
		      (response) => {
		        console.log(response.data);


		        return response.data;
		      }
		 );
	}


	/**
	 * Transform a member to an assignee 
	 * @param  $chip  Object  
	 */
	transformChip(chip) {
		console.log(chip);

		// Transform member objects to assignee objects
		if ( angular.isObject(chip) && chip.task ) {
			return chip;
		}
		else {
			return {
				task: this.item.id,
				person: chip.person,
			}
		}
	}

	save() {
		let item = this.item;
		delete item['count_assigned'];
		delete item['count_completed'];
		delete item['entity'];
		delete item['__entity__'];
		return super.save(item);
	}

	/**
	* Load a current copy of the selected item
	* return Object A fresh copy of the item from the database
	*/
	refreshItem() {
	  this.service.get(this.item.id).then(
	        (response) => {
	            
	            let item = this.item = response.data;
				item.bullet_points  	= item.bullet_points || [];
				item.assignees      	= item.assignees || [];              
	        },
	        (error) => {
	            console.log('Could not refresh item.');
	            console.log(error);
	        }
	    );
	}



    // addBullet(item,label) {
    // 	console.log('Add bullet: ' + label);
    //   	item.bullet_points.push(label);
    //   // let data = { id: item.id, bullet_points: item.bullet_points };
    //   // item._add_bullet_text = '';

    //   // this.service.save(data).then(
    //   //   (response) => {
    //   //       // item.bullet_points = item.bullet_points + "\n" + label;
    //   //       // item.assignees.push(assignee);
    //   //   },
    //   //   () => {
            
    //   //   });
    // }

    // removeBullet(item,index) {
    //   item.bullet_points.splice(index,1);
    //   // let data = { id: item.id, bullet_points: item.bullet_points };

    //   // this.service.save(data).then(
    //   //   (response) => {
    //   //       // item.bullet_points = item.bullet_points + "\n" + label;
    //   //       // item.assignees.push(assignee);
    //   //   },
    //   //   () => {
            
    //   //   });
    // }

  
}