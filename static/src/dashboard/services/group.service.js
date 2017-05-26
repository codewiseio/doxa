export default class GroupService {

   constructor($http, $cookies) {
      'ngInject';
      this.$http = $http;
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
   list( params={} ) {
      return this.$http.get(`/api/v1/groups/`,        
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

   addMember(item) {
      return this.$http.post(`/api/v1/groups/${item.group_id}/members/`, item);
   }
}

