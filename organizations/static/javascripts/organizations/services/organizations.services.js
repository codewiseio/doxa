/**
* Organizations
* @namespace doxa.organizations.services
*/
(function () {
  'use strict';

  angular
    .module('doxa.organizations.services',[])
    .factory('Organizations', Organizations);

  Organizations.$inject = ['$http'];

  /**
  * @namespace Organizations
  * @returns {Factory}
  */
  function Organizations($http) {
    var Organizations = {
      all: all,
      create: create,
      get: get
    };

    return Organizations;


    ////////////////////

    /**
    * @name all
    * @desc Get all Organizations
    * @returns {Promise}
    * @memberOf thinkster.organizations.services.Organizations
    */
    function all() {
      return $http.get('/api/v1/organizations/');
    }


    /**
    * @name create
    * @desc Create a new Organization
    * @param {string} content The content of the new Organization
    * @returns {Promise}
    * @memberOf thinkster.organizations.services.Organizations
    */
    function create(data) {
      return $http.post('/api/v1/organizations/', data );
    }

    /**
     * @name get
     * @desc Get the Organizations of a given user
     * @param {string} username The username to get Organizations for
     * @returns {Promise}
     * @memberOf thinkster.organizations.services.Organizations
     */
    function get(id) {
      return $http.get('/api/v1/organizations/' + id);
    }
  }
})();
