export default class GroupService {

   constructor($http, $cookies) {
      'ngInject';
      this.$http = $http;
   }

   /**
    * sort events
    * @param  {int} id and filter_name
    * @return {Promise}
    */
   sort(id,filter_name){
      return this.$http.get(`/api/v1/sortGroups/org/${id}/filter/${filter_name}/`,        
        {
        }
      );
   }

   /**
    * Delete the group
    * @param  {Int} id Record ID
    * @return {Promise} 
    */
   delete(id) {
      return this.$http.delete(`/api/v1/groups/${id}/`);
   }
   
   /**
    * Retrieve the group
    * @param  {int} id Record ID
    * @return {Promise}
    */
   get(id, params={} ) {
      return this.$http.get(`/api/v1/groups/${id}/`,
        {
          params: params
        }
      );
   }
   
   /**
    * List groups
    * @param  {int} id
    * @return {Promise}
    */
   list( id,params={} ) {
      return this.$http.get(`/api/v1/getgroups/${id}/`,        
        {
          params: params
        }
      );
   }
   
   /**
    * Save record
    * @param  {obj} data Object to save to database
    * @return {Promise}
    */
   save(data) {
      if ( data.id ) {
         return this.$http.patch(`/api/v1/groups/${data.id}/`, data );
      }
      else {
         return this.$http.post(`/api/v1/groups/`, data );
      }
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
      console.log("member")
      console.log(member)
      return this.$http.patch(`/api/v1/groups/${member.group}/member/${member.id}/`, member);
   }

   removeMember(member) {
    return this.$http.delete(`/api/v1/groups/${member.group}/member/${member.id}/`);
   }

   removeMembers(members) {
    console.log('Removing members');
    console.log(members);

    // get ids from members array
    var ids = [];
    members.forEach( function(item) {
      ids.push(item.id);
    });


    // pass ids to the api
    return this.$http.post(`/api/v1/groups/${members[0].group}/members/remove/`, { ids: ids } );
   }


   //Remove groups
   removeGroups(groups,id) {
    console.log('Removing groups');
    console.log(groups);

    // get ids from groups array
    var ids = [];
    groups.forEach( function(item) {
      ids.push(item.id);
    });
    console.log('ids',ids)

    // pass ids to the api
    return this.$http.post(`/api/v1/groups/remove/`, { ids: ids,org: id } );
   }
}

