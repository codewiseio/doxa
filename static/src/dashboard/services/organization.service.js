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
      return this.$http.get(`/api/v1/organizations/${id}/`,{
         params: {
           context: 'dashboard.organization.edit',
         }
      });
   }
   
}

