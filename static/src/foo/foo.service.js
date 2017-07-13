export default class FooService {
   constructor($http) {
      'ngInject';
      
      this.$http = $http;
      
      // Object to store our user properties
      this.current = null;
   }
   
    get(id) {
      return this.$http.get(`/api/v1/foo/${id}/`,{
         params: {
           context: 'dashboard.organization.edit',
         }
      });
   }
   
   save(data) {
      if ( data.id ) {
         return this.$http.patch(`/api/v1/foo/${data.id}/`, data );
      }
      else {
         return this.$http.post(`/api/v1/foo/`, data );
      }
      
   }
   
}

