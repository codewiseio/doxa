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
   get(id, params={}) {
      return this.$http.get(`/api/v1/members/${id}/`,{
         params: params
      });

   }
   
   /**
    * Get members
    * @param  {[type]} moniker [description]
    * @return {[type]}         [description]
    */
   list(id, params={} ) {
      return this.$http.get(`/api/v1/organizations/${id}/members/`,
        {
          params: params
        }
      );
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
      console.log("DATA IS : ")
      console.log(data)
      if ( data.id ) {
         console.log("id" + data.id);
         return this.$http.patch(`/api/v1/members/${data.person.id}/`, data );
      }
      else {
         return this.$http.post(`/api/v1/members/`, data );
      }
      
   }

    //Remove selected members
   deleteMultiple(members) {
      // pass ids to the api
      return this.$http.post(`/api/v1/members/remove/`, { ids: members } );
   }

   
}

