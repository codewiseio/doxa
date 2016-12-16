/**
 * Authenication
 * @namespace doxa.registration.services
 */

(function() {
   'use strict';
   
    angular
        .module('doxa.registration.services')
        .factory('Registration',Registration);
    
    Registration.$inject = ['$cookies','$http','Authentication'];
    
    /***
     * @namespace Registration
     * @returns {Factory}
     */
    function Registration($cookies,$http,Authentication) {
        /***
         * @name Registration
         * @desc The Factory to be returned
         */
        var Registration = {
            registerUser: registerUser,
            registerUserAndOrganization: registerUserAndOrganization,
        };
        
        return Registration;
        
        ////////////////////////////////////
        
         /**
         * @name register
         * @desc Try to register a new user
         * @param {string} email The email entered by the user
         * @param {string} password The password entered by the user
         * @returns {Promise}
         * @memberOf doxa.registration.services.Registration
         */
         function registerUser(email,password) {
            return $http.post('/api/v1/users/', {
                password: password,
                email: email
            }).then(registerSuccessFn, registerErrorFn);
        
            /**
             * @name registerSuccessFn
             * @desc Log the new user in
             */
            function registerSuccessFn(data, status, headers, config) {
                Registration.login(email,password);
            }
            
            /**
             * @name registerErrorFn
             * @desc Log "Epic Failure!" to the console
             */
            function registerErrorFn(data,status,headers,config) {
                console.error('Epic failure!');
            }
         }
         
         /**
         * @name registerUserAndOrganization
         * @desc Register a new user and create a new organization
         * @param {object} user The user data entered by the user
         * @param {object} organization The organization data entered by the user
         * @returns {Promise}
         * @memberOf doxa.registration.services.Registration
         */
         function registerUserAndOrganization(user,organization) {
            console.log(user);
            console.log(organization);
            
            registerUserFn(user).then(
               registerSuccessFn,
               //registerOrganizationFn.then( registerSuccessFn, registerOrganizationErrorFn),
               registerUserErrorFn
            );
            
            function registerUserFn(user) {
               return $http.post('/api/v1/users/', {'email': user.email, 'password': user.password} );
            }
            
            /**
             * @name registerSuccessFn
             * @desc Log the new user in
             */
            function registerSuccessFn(data, status, headers, config) {
                Authentication.login(user.email,user.password);
            }
            
            /**
             * @name registerErrorFn
             * @desc Log "Epic Failure!" to the console
             */
            function registerUserErrorFn(data,status,headers,config) {
                console.error('Epic failure!');
                console.log(data);
            }
         
            
            //function registerOrganizationFn(
            //   //return $http.post('/api/v1/organizations', organization );
            //)
            //
            //return $http.post('/api/v1/users/', {
            //    password: password,
            //    email: email
            //}).then(registerSuccessFn, registerErrorFn);
         }
        
        
        
    }
})();