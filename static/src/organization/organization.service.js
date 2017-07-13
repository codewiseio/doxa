export default class OrganizationService {
    constructor($http) {
        'ngInject';
        
        this.$http = $http;
    }

    /**
     * Retrieve organization data
     * @param  slug Organization id or slug
     * @return Promise
     */
    get( slug, params ) {
      return this.$http.get(`/api/v1/organizations/${slug}/`, {
         params: params
      });
   

   // save(data) {
   //    console.log('Saving organization');
   //    console.log(data);
      
   //    if ( data.id ) {
   //       return this.$http.patch(`/api/v1/organizations/${data.id}/`, data );
   //    }
   //    else {
   //       return this.$http.post(`/api/v1/organizations/`, data );
   //    }
   }
   
}

