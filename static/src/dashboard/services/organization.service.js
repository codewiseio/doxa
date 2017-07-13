export default class DashboardOrganizationService {
   constructor($http, $cookies) {
      'ngInject';
      
      this.$http = $http;
      this.$cookies = $cookies;
      
      // Object to store our user properties
      this.current = null;
   }
   
    /**
    * @name get
    * @desc Retrieve data for an organization
    * @param {int/string} id Organization id or slug
    * @param {string} password The password entered by the use
    * @returns {Promise}
    * @memberOf doxa.dashboard.services.organization
    */
    get(id) {
      return this.$http.get(`/api/v1/organizations/${id}/`, {
         params: {
           context: 'dashboard.organization.edit',
         }
      });
   }
   
   /**
    * @name save
    * @description Save data for an organization
    * @param {object} Organization object
    * @returns {Promise}
    * @memberOf doxa.dashboard.services.organization
    */
   save(data) {
      console.log('Saving');
      console.log(data);
      
      if ( data.id ) {
         return this.$http.patch(`/api/v1/organizations/${data.id}/`, data );
      }
      else {
         return this.$http.post(`/api/v1/organizations/`, data );
      }
   }
   
}

