
( function() {
    'use strict';
    angular
        .module('doxa.registration.controllers')
        .controller('RegisterController',RegisterController);
        
        RegisterController.$inject = ['$location','$scope','Registration','Authentication'];
        
        /***
         * @namespace RegisterController
         */
        function RegisterController($location,$scope,Registration,Authentication) {
            var vm = this;
            vm.register = register;
            vm.registerUserAndOrganization = registerUserAndOrganization;
            vm.user = {};
            vm.organization = {};
            
            activate();
            
            /**
             * @name activate
             * @desc Actions to be performed when this controller is instantiated
             * @memberOf doxa.registration.controllers.RegisterController
             */
            function activate() {
                // If the user is authenticated, they should not be here
                if ( Authentication.isAuthenticated() ) {
                    $location.url('/');
                }
            }
            
            /***
             * @name registerUserAndOrganization
             * @desc Register a new user and organization
             * @memberOf doxa.registration.controllers.RegisterController
             */
            function registerUserAndOrganization() {
                Registration.registerUserAndOrganization(vm.user,vm.organization);
            }
            
            /***
             * @name register
             * @desc Register a new user
             * @memberOf doxa.registration.controllers.RegisterController
             *
             * ** DEPRECATED **
             */
            function register() {
                Registration.register(vm.email, vm.password, vm.username);
            }
        }
    
})();
