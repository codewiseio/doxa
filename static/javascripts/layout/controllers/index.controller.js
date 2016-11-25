/**
 * IndexController
 * @namespace doxa.layout.controllers
 */
(function() {
    'use strict';
    
    angular
        .module('doxa.layout.controllers')
        .controller('IndexController',IndexController);
    
    IndexController.$inject = ['$scope','Authentication'];
    
    /**
     * @namespace IndexController
     */
    function IndexController($scope, Authentication) {
        var vm = this;
        vm.logout = logout;
        //vm.isAuthenticated = Authentication.isAuthenticated();
        $scope.isAuthenticated = Authentication.isAuthenticated();
        
        
    
        
        /**
         * @name logout
         * @desc = Log the user out
         * @memberOf thinkster.layout.controllers.IndexController
         */
        function logout() {
            Authentication.logout();
        }
    }
})();