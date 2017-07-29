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
   
   /**
    * Retrieve the event
    * @param  {int} id Record ID
    * @return {Promise}
    */
   get(id, params={} ) {
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
   list(id, params={} ) {
      return this.$http.get(`/api/v1/events/organization/${id}/`,        
        {
          params: params
        }
      );
   }

   /**
    * sort events
    * @param  {int} id and filter_name
    * @return {Promise}
    */
   sort(id,filter_name){
      return this.$http.get(`/api/v1/events/org/${id}/filter/${filter_name}/`,        
        {
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

   //Remove selected events
   removeEvents(events,id) {
    console.log('Removing events');
    console.log(events);

    // get ids from groups array
    var ids = [];
    events.forEach( function(item) {
      ids.push(item.id);
    });
    console.log('ids',ids)

    // pass ids to the api
    return this.$http.post(`/api/v1/events/remove/`, { ids: ids,org: id } );
   }

}

