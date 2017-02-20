export default class DashboardMemberService {
   constructor($http, $cookies) {
      'ngInject';
      
      this.$http = $http;
      this.$cookies = $cookies;
      
      // Object to store our user properties
      this.current = null;
   }
   
    /**
    * @name get
    * @desc Retrieve data for an member
    * @param {int/string} id Member id or slug
    * @returns {Promise}
    * @memberOf doxa.dashboard.services.organization
    */
   get(id) {
      return this.$http.get(`/api/v1/members/${id}/`,{
         params: {
           context: 'dashboard.organization.member.edit',
         }
      });

   }
   
   /**
   * @name list
   * @description List members based on object moniker
   * @param {moniker} Object moniker
   * @returns {Promise}
   * @memberOf doxa.dashboard.services.members
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

