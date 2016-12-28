import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import routing from './doxa.config';
import uirouter from 'angular-ui-router';

angular
  .module('doxa', [
    'uirouter',
    'doxa.config',
    'doxa.routes',
    'doxa.authentication',
    'doxa.registration',
    //'doxa.organizations',
    'doxa.layout',
    'ngMaterial'
  ])
  .config(routing);
  


//(function () {
//    'use strict';
//
//    angular
//      .module('doxa', [
//        'doxa.config',
//        'doxa.routes',
//        'doxa.authentication',
//        'doxa.registration',
//        //'doxa.organizations',
//        'doxa.layout',
//        'ngMaterial'
//      ]);
//    
//    angular
//        .module('doxa.authentication', []);
//        
//    angular
//        .module('doxa.registration',[]);
//  
//    angular
//        .module('doxa.routes', ['ui-route']);
//      
//    angular
//        .module('doxa.config', [] );
//    
//    angular
//      .module('doxa')
//      .run(run);
//    
//    run.$inject = ['$http'];
//    
//    /**
//    * @name run
//    * @desc Update xsrf $http headers to align with Django's defaults
//    */
//    function run($http) {
//      $http.defaults.xsrfHeaderName = 'X-CSRFToken';
//      $http.defaults.xsrfCookieName = 'csrftoken';
//    }
//})();
//
//
