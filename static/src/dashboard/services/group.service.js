import CrudService from '../../lib/crud.service.js';

export default class GroupService extends CrudService {

   constructor($http, $cookies) {
      'ngInject';
      super();

      this.$http = $http;
      this._plural = 'groups';
      this._single = 'group';
   }


   /**
    * List groups
    * @param  {int} id
    * @return {Promise}
    */
   list( id,params={} ) {
      return this.$http.get(`/api/v1/${this._plural}/organization:${id}/`,        
        {
          params: params
        }
      );
   }
   
   /**
    * Get Members
    * @param  {obj} data Object to save to database
    * @return {Promise}
    */
   getMembers(id, params={} ) {
      return this.$http.get(`/api/v1/groups/${id}/members/`,
        {
          params: params
        }
      );
   }

   addMember(member) {
      return this.$http.post(`/api/v1/groups/${member.group_id}/members/`, member);
   }

   updateMember(member) {
      return this.$http.patch(`/api/v1/groups/${member.group}/member/${member.id}/`, member);
   }

   removeMember(member) {
    return this.$http.delete(`/api/v1/groups/${member.group}/member/${member.id}/`);
   }

   removeMembers(members) {
    // get ids from members array
    var ids = [];
    members.forEach( function(item) {
      ids.push(item.id);
    });


    // pass ids to the api
    return this.$http.post(`/api/v1/groups/${members[0].group}/members/remove/`, { ids: ids } );
   }



}

