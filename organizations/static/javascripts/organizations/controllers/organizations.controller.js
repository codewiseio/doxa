( function() {
    'use strict';
    angular
        .module('doxa.organization.controllers')
        .controller('OrganizationController',OrganizationController);
        
        OrganizationController.$inject = ['$location','$scope','Authentication'];
        
        /***
         * @namespace OrganizationController
         */
        function OrganizationController($location,$scope,Authentication) {
            var vm = this;
            vm.organization = {};
            
            activate();
            
            /**
             * @name activate
             * @desc Actions to be performed when this controller is instantiated
             * @memberOf doxa.registration.controllers.OrganizationController
             */
            function activate() {
                // If the user is authenticated, they should not be here
                if ( ! Authentication.isAuthenticated() ) {
                    $location.url('/');
                }
            }
            

        }
    
})();












