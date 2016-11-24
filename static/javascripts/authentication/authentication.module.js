(function () {
  'use strict';

  angular
    .module('doxa.authentication', [
      'doxa.authentication.controllers',
      'doxa.authentication.services'
    ]);

  angular
    .module('doxa.authentication.controllers', []);

  angular
    .module('doxa.authentication.services', ['ngCookies']);
})();