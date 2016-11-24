/**
 * Authentication
 * @namespace doxa.authentication.services
 */

(function() {
   'use strict';
   
    angular
        .module('doxa.authentication.services')
        .factory('Authentication',Authentication);
    
    Authentication.$inject = ['$cookies','$http'];
    
    /***
     * @namespace Authentication
     * @returns {Factory}
     */
    function Authentication($cookies,$http) {
        /***
         * @name Authentication
         * @desc The Factory to be returned
         */
        var Authentication = {
            register: register
        };
        
        return Authentication;
        
        ////////////////////////////////////
        
        /**
         * @name register
         * @desc Try to register a new user
         * @param {string} email The email entered by the user
         * @param {string} password The password entered by the user
         * @returns {Promise}
         * @memberOf doxa.authentication.services.Authentication
         */
        
        function register(email,password) {
            return $http.post('/api/v1/users/', {
                password: password,
                email: email
            });
        }
    }
})();