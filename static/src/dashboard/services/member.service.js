export default class DashboardMemberService {
   constructor($http, $cookies) {
      'ngInject';
      
      this.$http = $http;
      this.$cookies = $cookies;
      
      // Object to store our user properties
      this.current = null;
   }

   /**
    * Delete the member
    * @param  {Int} id Record ID
    * @return {Promise} 
    */
   delete(id) {
      return this.$http.delete(`/api/v1/members/${id}/`);
   }
   
   /**
    * Get the member
    * @param  {int} id Record ID
    * @return {Promise}
    */
   get(id) {
      return this.$http.get(`/api/v1/members/${id}/`,{
         params: {
           context: 'dashboard.organization.member.edit',
         }
      });

   }
   
   /**
    * Get members
    * @param  {[type]} moniker [description]
    * @return {[type]}         [description]
    */
   list(moniker) {
      return this.$http.get(`/api/v1/members/${moniker}/`, {
         
      });
   }
   
   /**
    * @name save
    * @description Save data for an organization
    * @param {object} Member object
    * @param {boolean} Update contact information
    * @returns {Promise}
    * @memberOf doxa.dashboard.services.members
    */
   save(data) {
      if ( data.id ) {
         return this.$http.patch(`/api/v1/members/${data.id}/`, data );
      }
      else {
         return this.$http.post(`/api/v1/members/`, data );
      }
      
   }


   
}

