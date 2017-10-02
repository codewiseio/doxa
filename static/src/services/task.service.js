
import CrudService from '../lib/crud.service';

export default class TaskService extends CrudService {

   constructor($http) {
      'ngInject';
      super();

      this.$http = $http;
      this._plural = "tasks";
      this._single = "task";
   }

   completeTask(task, completed) {
      let data = {
        id: task.id,
        status: 1,
      };
      return this.$http.patch(`/api/v1/${this._plural}/${task.id}/complete/$`, data);
   }

   archiveTask(task) {
      let data = {
          id: task.id,
          status: 2,
          archived: 1,
      };
      return this.$http.patch(`/api/v1/${this._plural}/${task.id}/assignee/${assignee.id}/`, data);
   }

   /**
    * Mark an assignee as having completed their task
    * @param  {[type]} assignee [description]
    * @return Promise
    */
   updateAssignee(assignee) {
   		return this.$http.patch(`/api/v1/${this._plural}/${assignee.task}/assignee/${assignee.id}/`, assignee);
   }


   /**
    * Remove a person from a task
    * @param
    */
   removeAssignee(assignee) {
       return this.$http.delete(`/api/v1/${this._plural}/${assignee.task}/assignee/${assignee.id}/` );
   }

   /**
    * Remove a person from a task
    * @param
    */
   undoRemoveAssignee(assignee) {
      let instance = {
        id: assignee.id,
        task_id: assignee.task,
        person_id: assignee.person.id,
        completed: assignee.completed
      };
      return this.$http.post(`/api/v1/${this._plural}/${assignee.task}/assignees/`, instance );
   }

   /**
    * Assign a task to a person
    * @param
    */
   assignTo(task, person) {
      let assignee = {
        task_id: task.id,
        person_id: person.id,
        completed: false,
      }
      return this.$http.post(`/api/v1/${this._plural}/${task.id}/assignees/`, assignee );
   }



}

