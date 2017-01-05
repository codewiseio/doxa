(function () {
  'use strict';

  angular
    .module('doxa.registration', [
      'doxa.registration.controllers',
      'doxa.registration.services',
      'ngAnimate'
    ]);

  angular
    .module('doxa.registration.controllers', []);

  angular
    .module('doxa.registration.services', ['ngCookies']);
})();