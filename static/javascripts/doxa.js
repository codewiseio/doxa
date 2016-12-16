(function () {
    'use strict';

    angular
      .module('doxa', [
        'doxa.config',
        'doxa.routes',
        'doxa.authentication',
        'doxa.registration',
        'doxa.layout'
      ]);
    
    angular
        .module('doxa.authentication', []);
        
    angular
        .module('doxa.registration',[]);
  
    angular
        .module('doxa.routes', ['ui-route']);
      
    angular
        .module('doxa.config', [] );
    
    angular
      .module('doxa')
      .run(run);
    
    run.$inject = ['$http'];
    
    /**
    * @name run
    * @desc Update xsrf $http headers to align with Django's defaults
    */
    function run($http) {
      $http.defaults.xsrfHeaderName = 'X-CSRFToken';
      $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();


