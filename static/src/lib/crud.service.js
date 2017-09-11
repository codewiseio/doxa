


export default class CrudService {

	/**
    * Delete a record
    * @param  {Int} id Record ID
    * @return {Promise} 
    */
   delete(id) {
      return this.$http.delete(`/api/v1/${this._plural}/${id}/`);
   }

	/**
    * Delete multiple records
    * @param  {Int} id Record ID
    * @return {Promise} 
    */
   deleteMultiple(ids) {
    // pass ids to the api
    return this.$http.post(`/api/v1/${this._plural}/remove/`, { ids: ids } );
   }
   
   /**
    * Retrieve a record
    * @param  {int} id Record ID
    * @return {Promise}
    */
   get(id, params={} ) {
      return this.$http.get(`/api/v1/${this._plural}/${id}/`,
        {
          params: params
        }
      );
   }
   
   /**
    * List records
    * @param  {int} id
    * @return {Promise}
    */
   list(params={} ) {
      return this.$http.get(`/api/v1/${this._plural}/`,        
        {
          params: params
        }
      );
   }
   
   /**
    * Create or update a record
    * @param  Object data Object data
    * @return Promise Record data
    */
   save(data) {
      if ( data.id ) {
         return this.$http.patch(`/api/v1/${this._plural}/${data.id}/`, data );
      }
      else {
         return this.$http.post(`/api/v1/${this._plural}/`, data );
      }
   }

}