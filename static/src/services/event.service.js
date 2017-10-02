export default class EventService {

   constructor($http, $cookies) {
      'ngInject';
      this.$http = $http;
   }

   /**
    * Delete the event
    * @param  {Int} id Record ID
    * @return {Promise} 
    */
   delete(id) {
      return this.$http.delete(`/api/v1/events/${id}/`);
   }

   //Remove selected events
   deleteMultiple(ids) {
    // pass ids to the api
    return this.$http.post(`/api/v1/events/remove/`, { ids: ids } );
   }
   
   /**
    * Retrieve the event
    * @param  {int} id Record ID
    * @return {Promise}
    */
   get(id, params={} ) {
      console.log(`/api/v1/events/${id}/`);
      return this.$http.get(`/api/v1/events/${id}/`,
        {
          params: params
        }
      );
   }
   
   /**
    * List events
    * @param  {int} id
    * @return {Promise}
    */
   list(params={} ) {
      return this.$http.get(`/api/v1/events/`,        
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
         return this.$http.patch(`/api/v1/events/${data.id}/`, data );
      }
      else {
         return this.$http.post(`/api/v1/events/`, data );
      }
   }



}

