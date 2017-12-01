export default class GuestService {
   constructor($http, $cookies) {
      'ngInject';
      
      this.$http = $http;
      this.$cookies = $cookies;
      
      // Object to store our user properties
      this.current = null;
   }

   /**
    * List all people who can be invited to the event
    * @param  Integer id Event id
    * @return Promise 
    */
   eligible(id) {
      return this.$http.get(`/api/v1/events/${id}/guests/eligible/`);
   }

   /**
    * Going
    * @param  Integer id Event id
    * @return Promise 
    */
   going(id) {
      return this.$http.get(`/api/v1/events/${id}/guests/going/`);
   }


   /**
    * Invite guests to the event
    * @param  Integer id      Event ID
    * @param  Array   people  List of person IDs to invite
    * @param  Obj     params  Paramaters
    * @return Promis
    */
   invite(id, people, params={} ) {
      return this.$http.post(`/api/v1/events/${id}/guests/invite/`, 
        {
          people: people,
          params: params
        });
   }

   /**
    * Interested
    * @param  Integer id Event id
    * @return Promise 
    */
   interested(id) {
      return this.$http.get(`/api/v1/events/${id}/guests/interested/`);
   }
   

   /**
    * List all people who can be invited to the event
    * @param  Integer id Event id
    * @return Promise 
    */
   list(id,params) {
      return this.$http.get(`/api/v1/events/${id}/guests/`, 
        {
          params: params
        });
   }

   /**
    * List all people who can be invited to the event
    * @param  Integer id Event id
    * @return Promise 
    */
   remove(id,params) {
      return this.$http.delete(`/api/v1/guests/${id}/`, 
        {
          params: params
        });
   }
}

