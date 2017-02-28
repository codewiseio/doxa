export default class UserService {
   constructor($http, $cookies) {
      'ngInject';
      
      this.$http = $http;
      this.$cookies = $cookies;
      
      // Object to store our user properties
      this.current = null;
   }

   
   /**
    * Update this user in the database
    * @param  {obj} data User data
    * @return {Promise}
    */
   save(data) {
      if ( data.id ) {
         return this.$http.patch(`/api/v1/users/${data.id}/`, data );
      }
      else {
         return this.$http.post(`/api/v1/users/`, data );
      }
      
   }


   
}

